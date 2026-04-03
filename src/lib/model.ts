const HF_BASE = "https://nerdyalgorithm-oralscan-model.hf.space";

export async function loadModel(): Promise<void> {}

export async function predict(imageElement: HTMLImageElement): Promise<{ className: string; confidence: number }> {
  const canvas = document.createElement("canvas");
  canvas.width = 224;
  canvas.height = 224;
  canvas.getContext("2d")!.drawImage(imageElement, 0, 0, 224, 224);

  const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), "image/jpeg"));

  // Step 1: Upload the file
  const uploadForm = new FormData();
  uploadForm.append("files", blob, "image.jpg");
  const uploadRes = await fetch(`${HF_BASE}/gradio_api/upload`, { method: "POST", body: uploadForm });
  if (!uploadRes.ok) throw new Error("Upload failed");
  const uploadedPaths: string[] = await uploadRes.json();

  // Step 2: Call predict_image endpoint
  const callRes = await fetch(`${HF_BASE}/gradio_api/call/predict_image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [{ path: uploadedPaths[0], meta: { _type: "gradio.FileData" } }]
    })
  });
  if (!callRes.ok) throw new Error("Prediction call failed");
  const { event_id } = await callRes.json();

  // Step 3: Get the result via SSE
  const resultRes = await fetch(`${HF_BASE}/gradio_api/call/predict_image/${event_id}`);
  if (!resultRes.ok) throw new Error("Result fetch failed");
  
  const text = await resultRes.text();
  // Parse SSE: find the "data:" line with JSON
  const dataLine = text.split("\n").find(l => l.startsWith("data:"));
  if (!dataLine) throw new Error("No data in response");
  const parsed = JSON.parse(dataLine.slice(5).trim());

  // parsed is [labelData, confidenceScores]
  // labelData = { label: "...", confidences: null }
  // confidenceScores = { "Oral Homogenous Leukoplakia": 9.22, ... }
  const labelData = parsed[0];
  const confidenceScores = parsed[1];
  const className = labelData.label;
  const confidence = confidenceScores?.[className] ?? 0;

  return { className, confidence };
}
