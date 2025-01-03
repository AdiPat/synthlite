# SynthLite 🌞

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-green)](https://nodejs.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)](#contributors)

> 🚨 **Disclaimer:** SynthLite is a work in progress. Expect bugs, fun, and room for improvement.

## Introduction 💡

**SynthLite ⚡️** is a **synthetic data generation CLI tool and library** written in TypeScript. It’s designed to help you quickly produce high-quality synthetic datasets—perfect for development, testing, or even for product features and experiments. 🥢

<p align="center" width="100%">
    <img width="100%" src="https://cdn.pixabay.com/photo/2023/04/03/13/26/wallpaper-7896859_1280.jpg">
</p>

> 💬 **Why?** Because synthetic data opens new frontiers for experimentation, privacy-friendly testing, and robust model training—helping developers and researchers alike! 😎

Under the hood, synthlite demonstrates the **speed and power** of various large language models (LLMs), including those from OpenAI, Anthropic, Meta, and Groq, showcasing how seamlessly they can integrate for data generation. ⚙

## Partnerships & Future Collaboration 🤝

> 🚦 synthlite is not affiliated with any of the mentioned organizations and is an independent "hacker" project. However, in this note, I wish to propose future partnerships or collaborations with any or all of OpenAI, Anthropic, Meta, and Groq.

Here at **synthlite**, we're always on the lookout for meaningful collaborations to take synthetic data generation to the next level. While our current setup already demonstrates the capabilities of various LLMs, we envision broader use cases and accelerated growth through strategic partnerships with:

- **OpenAI:** Explore how advanced AI models can be utilized effectively across diverse tasks, moving closer to Artificial General Intelligence (AGI) by leveraging existing technologies.

- **Anthropic:** Investigate the potential of AI models in creating nuanced synthetic data, contributing to the development of safe and reliable AI systems.

- **Meta:** Examine how Llama 3.x and future Llama variants can seamlessly integrate with synthlite for more sophisticated data generation scenarios.

- **Groq:** Further explore advanced hardware acceleration and develop cutting-edge benchmarks that highlight how synthlite combined with Groq can enhance synthetic data pipelines.

If you have any leads or are directly affiliated with these organizations (or similar), feel free to reach out! We believe that combining our open-source vision with innovative partners can push synthetic data tools even further—providing the community with faster, safer, and more adaptable ways to generate synthetic datasets. 🚀

> 💡 It would be amazing to see where our vision and hacker-like execution (which I picked up by studying Meta's culture) could take us. 🐺

---

# Innovative Approaches 💡

In the development of SynthLite, we have employed several innovative approaches and techniques to enhance the synthetic data generation process. These methods draw from various computer science and engineering concepts, ensuring the generation of high-quality, diverse, and realistic synthetic data. Below are some of the key approaches:

## Injecting Randomness via Mutation of Duplicates 🌱

To ensure the uniqueness and diversity of the generated data, we inject randomness by mutating duplicates. This involves making minor adjustments to existing data points to create new, unique entries. This technique helps in avoiding repetitive patterns and ensures that the synthetic data remains varied and realistic.

## Mutation Concept and Genetic Programming 🐞

The concept of mutation used in SynthLite is inspired by genetic programming. In genetic programming, mutation is a genetic operator used to maintain genetic diversity within a population of solutions. Similarly, in SynthLite, mutation is applied to duplicate data points to introduce variations and prevent redundancy. This approach ensures that the generated data evolves and adapts, much like in genetic algorithms.

## Schema-Driven Data Generation 🥤

SynthLite leverages JSON schemas to define the structure and constraints of the synthetic data. By converting JSON schemas to Zod schemas, we ensure that the generated data adheres to the specified format and validation rules. This schema-driven approach provides flexibility and precision in data generation.

## AI-Powered Data Generation 🪄

SynthLite integrates AI models to generate synthetic data. By providing prompts and schemas to the AI, we harness the power of language models to create realistic and contextually appropriate data points. This AI-driven approach enhances the quality and coherence of the generated data.

## Event-Driven Architecture 🎪

The use of an event-driven architecture with the SynthliteEmitter allows for efficient handling of data generation events. This architecture enables real-time processing and writing of generated data, ensuring a smooth and responsive data generation workflow.

## Performance Optimization ⚡️

To optimize performance, SynthLite processes data in batches and measures the time taken for each batch. This approach helps in identifying bottlenecks and ensures efficient utilization of resources during data generation.

By combining these innovative approaches, SynthLite provides a robust and flexible solution for synthetic data generation, catering to a wide range of use cases and ensuring high-quality outputs.

---

## Table of Contents 📚

- [Introduction](#introduction-)
- [Core Features](#core-features-)
- [Potential Problem Statements & Research Areas](#potential-problem-statements--research-areas-)
- [How It Works](#how-it-works-)
- [Setup Instructions](#setup-instructions-)
- [Usage Instructions](#usage-instructions-)
- [Examples](#examples-)
- [Contributors](#contributors-)
- [License](#license-)

---

## Core Features 🔧

- **Optimized Generation:** Harness the power of various LLMs for **efficient** synthetic data generation.

- **TypeScript Library & CLI:** Use synthlite as a standalone CLI or integrate directly into your projects.

- **Schema-Based Datasets:** Initialize a dataset with your `jsonSchema` for structured, valid data every time.

- **Flexible Output Formats:** Save generated data in **JSON** or **CSV**—or just work with it in-memory as a JavaScript object.

- **LLM Integration:** (Optional) Use the power of models like Llama 3.x to enhance realism and variety in your synthetic data.

---

## Potential Problem Statements & Research Areas 🔎

1. **Privacy & Compliance:** Generate synthetic datasets that mimic real-world data distributions without exposing sensitive information.

2. **High-Volume Testing:** Rapidly create large datasets for load testing or performance benchmarking.

3. **AI Model Training:** Explore how synthetic data can be used to train or fine-tune AI models while preserving privacy.

4. **Performance Research:** Investigate how hardware acceleration can supercharge the synthetic data generation process.

5. **Multi-Modal Future:** Potential exploration of text, image, or even audio synthetic data using advanced AI models.

Relevance: As the need for large, diverse, and privacy-friendly datasets grows, **synthlite** aims to deliver a swift, flexible solution that caters to the modern data-driven ecosystem.

---

## How It Works ⚙️

1. **Create a Dataset**

   ```ts
   const dataset = new SynthliteDataset(jsonSchema);
   ```

   This sets up your data structure based on the JSON schema you provide.

2. **Generate Data**

   ```ts
   const generatedDataset = dataset.generate({ count: 1000 });
   ```

   Produces a `GeneratedDataset` object containing your synthetic samples.

3. **Save the Output**

   ```ts
   generatedDataset.save("output.json", "json");
   ```

   Exports the generated data in JSON or CSV formats—whichever you prefer.

All these steps leverage the efficiency of various LLMs and can optionally tap into models like Llama 3.x for enhanced generative capabilities.

---

## Setup Instructions 🔧

### Prerequisites

- **Node.js** v16+

- **TypeScript** 4.x

- Access to relevant AI models (if you plan to use LLM integration features)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd synthlite
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Build and Run

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Use the CLI (example):**

   ```bash
   npm start -- --schema ./mySchema.json --count 1000 --output data.json
   ```

   This will generate 1,000 samples using `mySchema.json` and save them to `data.json`.

---

## Usage Instructions 🕵️‍♂️

1. **Library Usage (TypeScript)**

   ```ts
   import { SynthliteDataset, SynthliteGeneratedDataset } from "synthlite";

   const jsonSchemaPath = "./schema.json";
   const dataset = await SynthliteDataset.fromSchemaFile(jsonSchemaPath);

   const generatedDataset: SynthliteGeneratedDataset = dataset.generate({
     count: 500,
   });
   await generatedDataset.save("output.csv", "csv");
   ```

2. **CLI Usage**

   - **Basic Command**

     ```bash
     npm start -- --schema ./mySchema.json --count 500
     ```

     This generates 500 samples and prints them to stdout.

   - **Save to File**

     ```bash
     npm start -- --schema ./mySchema.json --count 1000 --output data.csv
     ```

     Exports 1,000 samples to a `data.csv` file.

3. **Optional Llama 3.1 Hook**  
   If you have Llama 3.3 integrated, you can configure your dataset to add advanced generative power to your fields. See our docs for usage examples (if available).

---

## Examples 📊

### Generating a Simple JSON File

```bash
> npm start -- --schema ./mySchema.json --count 50 --output myData.json

Generating 50 samples...
Successfully saved to myData.json
```

---

## Contributors 💖

> ⚡️ synthlite is a product of AdiPat Labs.

- **Aditya Patange** (Founder, AdiPat Labs)

We welcome contributions! Feel free to open issues, fork the repo, and submit pull requests.

---

## License 📜

This project is licensed under the **AGPL v3**. See the [LICENSE](LICENSE) file for details.

---

> ✨ _"It's not fake data dude, it's 'synthetic' data. 🥼" — Oen_
