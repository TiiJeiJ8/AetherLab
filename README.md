# 📊 AetherLab

❕Adopting a tightly coupled architecture for the front and back end has greatly increased the difficulty of maintenance and development, necessitating a restructuring of the architecture to decouple the front and back end. 💪

**New Arch is Developing**

**If you find this project interesting and want to follow its progress, please give it a star🌟!**

---

```mermaid
graph TB
    A[User Interface Layer] --> B[Vue 3 Frontend]
    B --> C[Component System]
    B --> D[State Management Vuex]
    B --> E[Routing Vue Router]
    
    C --> F[Chart Components]
    C --> G[Data Processing Components]
    C --> H[UI Component Library]
    
    F --> I[ECharts Visualization]
    I --> J[25+ Chart Types]
    
    B --> K[HTTP Client]
    K --> L[Flask Backend API]
    L --> M[Data Processing Service]
    L --> N[Mathematical Modeling Service]
    L --> O[File Management System]
    
    style A fill:#e23e57
    style B fill:#c06c84
    style I fill:#c9d6df
    style L fill:#c9d6df

```

---

## Quick Start -- Chart Generation Process

1. **Upload Data File**
   Click the "Files" button to upload data files in CSV, Excel, or other formats.
   ![step-upload-file](/frontend/public/img-step/step-upload-file.gif)

2. **Check Data**
   Preview the uploaded data in the "Data Preview" panel to ensure it is correct.
   ![step-check-data](/frontend/public/img-step/step-check-data.gif)

3. **Add file to Workspace**
   Click the "Add to Workspace" button to add the selected file to your workspace.
   ![step-add-workspace](/frontend/public/img-step/step-add-workspace.gif)

4. **Select Chart Type**
   Choose the appropriate visualization from 25+ chart types.  
   ![step-select-chart-type](/frontend/public/img-step/step-select-chart-type.gif)

5. **Open Structure Panel**
   Click the "Structure" button to open the chart structure panel.
   ![step-open-structure-panel](/frontend/public/img-step/step-open-structure-panel.gif)

6. **Configure Chart**
   Set data mapping, styles, themes, and other parameters.
   ![step-config-chart](/frontend/public/img-step/step-config-chart.gif)

7. **Generate Chart**
   Click the "Apply Configuration" button to create your visualization.
   ![step-generate-chart](/frontend/public/img-step/step-generate-chart.gif)

8. **Customization**
   Adjust styles, themes, data filters and advanced settings to meet your needs.
   ![step-customization](/frontend/public/img-step/step-customization.gif)

---

*Created by TiiJeiJ8*

![Star History Chart](https://api.star-history.com/svg?repos=TiiJeiJ8/AetherLab&type=Date)