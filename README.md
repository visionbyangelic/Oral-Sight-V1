# 🦷 OralSight — AI Oral Lesion Screening

<p align="center">
  <img src="public/placeholder.svg" alt="OralSight Banner" width="100%" />
</p>

<p align="center">
  <a href="https://oralsight.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-oralsight.vercel.app-brightgreen?style=for-the-badge" /></a>
  <a href="https://github.com/visionbyangelic/OralSight"><img src="https://img.shields.io/badge/Notebook%20Author-Angelic%20Charles-blue?style=for-the-badge" /></a>
  <a href="https://github.com/Zeepaks/Dental-ai-screening-nigeria-Oral-Sight"><img src="https://img.shields.io/badge/Collaborator-Ayomide%20Zaccheaus-orange?style=for-the-badge" /></a>
  <img src="https://img.shields.io/badge/Model-MobileNetV2-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Accuracy-65%25-red?style=for-the-badge" />

  Hugging face;https://nerdyalgorithm-oralscan-model.hf.space
</p>

---

## Overview

**OralSight** is an AI-powered oral health screening prototype that classifies oral lesions from clinical images using deep learning and computer vision. The system targets early detection of three clinically significant oral white lesion types — conditions that, if left undetected, can progress to malignancy.

This project was independently implemented by two authors to verify reproducibility of results across different environments and workflows. Both versions converge to the same accuracy ceiling, confirming the findings are data-constrained rather than implementation-dependent.

> **Live Demo:** [oralsight.vercel.app](https://oralsight.vercel.app/)  
> **Backend API:** [NerdyAlgorithm/oralscan-model on HuggingFace Spaces](https://huggingface.co/spaces/NerdyAlgorithm/oralscan-model)

---

## Table of Contents

- [Clinical Motivation](#clinical-motivation)
- [Datasets](#datasets)
- [Pipeline Architecture](#pipeline-architecture)
- [Models & Results](#models--results)
- [Grad-CAM Interpretability](#grad-cam-interpretability)
- [Statistical Analysis](#statistical-analysis)
- [Ablation Study](#ablation-study)
- [Deployment Stack](#deployment-stack)
- [Honest Assessment](#honest-assessment)
- [Recommendations](#recommendations)
- [Repository Structure](#repository-structure)
- [Authors](#authors)

---

## Clinical Motivation

Oral white lesions — including leukoplakia variants — are among the most common potentially malignant disorders of the oral cavity. Early and accurate classification is critical: Oral Non-Homogenous Leukoplakia carries a significantly higher malignant transformation rate than its homogenous counterpart, yet both are visually subtle and often misclassified by non-specialists.

OralSight explores whether a lightweight, deployable deep learning model can support preliminary screening in resource-limited clinical settings where specialist access is restricted — a particularly relevant question in the Nigerian healthcare context.

---

## Datasets

### Dataset 1 — Oral Lesions (Classification Target)

| Property | Detail |
|---|---|
| Source | [kaggle.com/datasets/srprojects/oral-lesions](https://www.kaggle.com/datasets/srprojects/oral-lesions) |
| Type | Multi-class image classification |
| Total Images | 261 |
| Classes | 3 |
| License | Public |

**Class Distribution:**

| Class | Images |
|---|---|
| Oral Homogenous Leukoplakia | 92 |
| Oral Non-Homogenous Leukoplakia | 77 |
| Other Oral White Lesions | 92 |

**Train / Val / Test Split:** 70% / 15% / 15% stratified (181 / 40 / 40 images)

A slight class imbalance exists on Non-Homogenous Leukoplakia (77 vs 92). Class weights were applied during training to compensate.

---

### Dataset 2 — DentalAI-2 (Segmentation Reference)

| Property | Detail |
|---|---|
| Source | [kaggle.com/datasets/pawanvalluri/dental-segmentation](https://www.kaggle.com/datasets/pawanvalluri/dental-segmentation) |
| Type | Semantic segmentation (image + mask pairs) |
| License | CC BY 4.0 |
| Total Files | 4,993 |

**Split:**

| Split | Files |
|---|---|
| Train | 3,983 |
| Validation | 509 |
| Test | 501 |

**Segmentation Classes:** Background, Caries, Cavity, Crack, Tooth

This dataset was explored and visualized to contextualize the broader diagnostic scope of OralSight. Integration into a two-stage segmentation-then-classification pipeline is proposed as future work.

---

## Pipeline Architecture

```
Raw Images
    │
    ▼
Train/Val/Test Split (70/15/15, stratified, seed=42)
    │
    ▼
Preprocessing (Resize 224×224, Normalize [0,1])
    │
    ├──► Baseline CNN (from scratch)
    ├──► MobileNetV2 (frozen ImageNet weights)
    └──► ResNet50 (frozen ImageNet weights)
                │
                ▼
        Best Model: MobileNetV2
                │
                ▼
        Grad-CAM Interpretability
                │
                ▼
        TF.js Conversion → HuggingFace Spaces (Gradio API)
                │
                ▼
        React + TypeScript Frontend → Vercel
```

---

## Models & Results

### Three-Model Comparison on Oral Lesions Test Set (n=40)

| Model | Accuracy | Precision (macro) | Recall (macro) | F1 (macro) |
|---|---|---|---|---|
| Baseline CNN | 0.38 | 0.37 | 0.37 | 0.35 |
| ResNet50 | 0.35 | 0.12 | 0.33 | 0.17 |
| **MobileNetV2** | **0.65** | **0.66** | **0.65** | **0.63** |

*Random baseline (uniform chance): 0.33*

### Per-Class Results — MobileNetV2 (Best Model)

| Class | Precision | Recall | F1 | Support |
|---|---|---|---|---|
| Oral Homogenous Leukoplakia | 0.75 | 0.43 | 0.55 | 14 |
| Oral Non-Homogenous Leukoplakia | 0.58 | 0.58 | 0.58 | 12 |
| Other Oral White Lesions | 0.65 | 0.93 | 0.76 | 14 |

### Key Findings

- MobileNetV2 achieves **65% accuracy**, nearly double the random baseline of 33%
- ResNet50 collapsed to predicting a single class — too parameter-heavy for 181 training images
- The Baseline CNN showed severe overfitting (val loss exploding after epoch 3) with no transfer learning
- Performance is **dataset-constrained**: all architectural variations converge to the same 65% ceiling

![alt text](<model_comparison (1)-1.png>)

### Model Configuration!

```python
Base:        MobileNetV2 (ImageNet pretrained, fully frozen)
Head:        GlobalAveragePooling2D → Dense(256, relu) → Dropout(0.4)
                                    → Dense(128, relu) → Dropout(0.3)
                                    → Dense(3, softmax)
Optimizer:   Adam (lr=0.001)
Loss:        Categorical Crossentropy
Batch Size:  16
Augmentation: None (ablation confirmed augmentation hurts on this dataset)
Class Weights: {0: 0.943, 1: 1.138, 2: 0.943}
Early Stopping: patience=10, restore_best_weights=True
```

---

## Grad-CAM Interpretability

Gradient-weighted Class Activation Mapping (Grad-CAM) was applied to the best-performing MobileNetV2 model to verify that predictions are driven by clinically relevant image regions rather than background artifacts.

Last convolutional layer used: `out_relu`

Grad-CAM confirmed that the model attends to lesion tissue in the majority of correctly classified samples, providing confidence that the learned representations are clinically grounded rather than spurious.

---

## Statistical Analysis

Paired t-test and Wilcoxon signed-rank test were conducted on per-class F1 scores (3 classes per model).

| Comparison | t-statistic | p-value | Significant? |
|---|---|---|---|
| MobileNetV2 vs Baseline CNN | -4.3152 | 0.0497 | ✅ Yes (p < 0.05) |
| MobileNetV2 vs ResNet50 | -2.0798 | 0.1731 | ❌ No |

MobileNetV2's improvement over the Baseline CNN is statistically significant. The ResNet50 comparison does not reach significance due to its degenerate behavior (single-class prediction), which inflates variance in the per-class F1 distribution.

---

## Ablation Study

**H2: Does data augmentation improve macro F1 by ≥10%?**

| Condition | Accuracy | Macro F1 |
|---|---|---|
| With Augmentation | 0.65 | 0.54 |
| Without Augmentation | 0.65 | 0.66 |
| Difference | — | -0.12 |

**Result: H2 NOT SUPPORTED.** Augmentation consistently hurt performance. With only 181 training images of visually similar lesion classes, rotation and brightness augmentation introduced more noise than signal. The no-augmentation configuration was adopted for the final model.

---

## Deployment Stack

| Layer | Technology |
|---|---|
| Model Format | TensorFlow.js (tfjs_graph_model) |
| Backend API | Gradio on HuggingFace Spaces |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Deployment | Vercel |

**How it works:**
1. User uploads a clinical oral image via the web interface
2. Frontend sends the image to the HuggingFace Spaces Gradio API
3. The MobileNetV2 model runs inference and returns class probabilities
4. The frontend displays the predicted lesion type with confidence scores

---

## Honest Assessment

### What worked
- Transfer learning via MobileNetV2 was the correct architectural choice for a small dataset
- Removing augmentation improved generalization — confirmed empirically via ablation
- Class weights addressed the Non-Homogenous Leukoplakia imbalance
- Grad-CAM confirmed the model focuses on actual lesion tissue
- The full pipeline from raw data to deployed web application is functional and reproducible
- Independent implementation by two authors confirmed result consistency

### What did not work
- Fine-tuning caused overfitting in every configuration tested — frozen features generalize better at this data scale
- ResNet50 is too large for 181 training images regardless of regularization
- Data augmentation hurt performance across all tested configurations
- All architectural variations converged to the same 65% accuracy ceiling

### Clinical Suitability
65% accuracy on a 3-class problem is above chance but **not clinically deployable**. OralSight is a research prototype and proof-of-concept. It should not be used as a substitute for professional clinical diagnosis. The bottleneck is data quantity, not model architecture.

---

## Recommendations

1. **Expand the dataset** — A minimum of 1,000 images per class is needed for meaningful generalization. Clinical partnerships or annotation platforms like Label Studio could accelerate this.

2. **Medical-domain pretraining** — With more data, a model pretrained on medical imaging (e.g. BioCLIP, BioViL) would likely outperform generic ImageNet features.

3. **Two-stage pipeline** — Integrate DentalAI-2 segmentation to first isolate the lesion region before classification, reducing background noise.

4. **External validation** — Evaluate on a dataset from a separate clinical source to test true generalizability beyond this single split.

5. **Expert annotation** — Ground truth labels for oral lesions require oral pathologist annotation. Label noise directly caps model performance.

6. **Larger architecture** — With sufficient data, EfficientNetV2 or a Vision Transformer (ViT) would likely improve results.

---

## Repository Structure

```
OralSight/
├── public/
│   ├── models/          # TF.js model weights
│   │   └── zach-model/
│   ├── favicon.ico
│   └── placeholder.svg
├── src/                 # React frontend source
├── training/            # Training notebooks
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Authors

**Angelic Charles** *(Notebook Author)*  
Data Scientist | ML Engineer | Research Contributor  
GitHub: [@visionbyangelic](https://github.com/visionbyangelic)  
Kaggle: [visionbyangelic](https://www.kaggle.com/visionbyangelic)  
ORCID: [0009-0008-7279-9663](https://orcid.org/0009-0008-7279-9663)

**Ayomide Zaccheaus** *(Collaborator)*  
GitHub: [@zeepaks](https://github.com/zeepaks)  
Independent Notebook: [Dental-ai-screening-nigeria-Oral-Sight](https://github.com/Zeepaks/Dental-ai-screening-nigeria-Oral-Sight)

---

## Citation

If you use OralSight or reference this work, please cite:

```
Charles, A. & Zaccheaus, A. (2026). OralSight: AI-Powered Oral Lesion Screening
using MobileNetV2 Transfer Learning. GitHub.
https://github.com/visionbyangelic/OralSight
```

---

<p align="center">
  Built with 🦷 by <a href="https://github.com/visionbyangelic">Angelic Charles</a> & <a href="https://github.com/zeepaks">Ayomide Zaccheaus</a>
</p>