# 📊 Fuck-Charts

**❕Adopting a tightly coupled architecture for the front and back end has greatly increased the difficulty of maintenance and development, necessitating a restructuring of the architecture to decouple the front and back end. 💪**

A Python/Dash web app for rapid data visualization & exploratory analysis. Upload datasets (CSV/Excel/JSON) and create interactive charts with rich customization.

---

## 🎥 Demo

![image](https://github.com/TiiJeiJ8/Fuck-Charts/blob/main/assets/IMG/screenShot.png)
- **Start page**

![image](https://github.com/TiiJeiJ8/Fuck-Charts/blob/main/assets/IMG/screenShot1.png)
- **Chart Visualization Page** (Line Chart)

![image](https://github.com/TiiJeiJ8/Fuck-Charts/blob/main/assets/IMG/screenShot2.png)
- **Chart Visualization Page** (Radar Chart)

![image](https://github.com/TiiJeiJ8/Fuck-Charts/blob/main/assets/IMG/screenShot3.png)
- **Data Preprocessing Page**

---

## ✨ Features

### 📁 Data Handling
- **Multi-format Support**: CSV, Excel (.xlsx, .xls), JSON
- **Upload Methods**: Drag-and-drop & file picker

### 📈 Visualization Types
| Basic Charts  | Statistical        | Geospatial   | Specialized     |
| ------------- | ------------------ | ------------ | --------------- |
| Line/Bar/Area | Box & Violin plots | Scatter maps | Treemaps        |
| Scatter plots | Heatmaps           |              | Sunburst charts |
| Pie charts    | Radar charts       |              |                 |

### 🎨 Customization
- **Styling**: Color themes (Viridis, Plasma), custom palettes, background colors
- **Layout**: Gridlines, aspect ratios (16:9, 4:3, etc), legend positioning
- **Annotations**: Mean/median lines, dynamic tooltips, export to PNG

### 🔍 Data Exploration
- **Auto Analysis**:
  - Dataset summary (size, dtypes)
  - Missing value visualization
  - Descriptive statistics
  - Numeric column boxplots
- **Interactive Tools**: Zoom, pan, live rendering toggle

---

## 🛠 Tech Stack
- **Backend**: Python 3.7+
- **Framework**: Dash
- **Visualization**: Plotly/Plotly Express
- **Data Processing**: Pandas
- **UI**: Dash Bootstrap Components
- **Utilities**: Scikit-learn

---

## 🚀 Quick Start

> **Note:** You can click the .exe file to run the application without installing Python and dependencies.

### 1.Requirements
- Python 3.7+
- pip package manager
- Virtual environment (recommended)

### 2.Installation
```bash
# Clone repository
git clone https://github.com/TiiJeiJ8/Fuck-Charts.git
cd Fuck-Charts

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/macOS

# Update pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Launch application
python app.py
```
Access at: `http://127.0.0.1:8050/`

---

## 📋 Usage Instructions

1. **Access the Application**
   - Visit the application URL (typically `http://127.0.0.1:8050/`)

2. **Navigate to Pages**
   - Go to either:
     - **Data Visualization** page 
     - **Data Preprocessing** page 🚧
     - **Data Clustering** page 🚧
     - **Mathematical Modeling** page 🚧
     - **Color Palette** page (Link)
     - **About ME** page (Link)

3. **Upload Data**
   - In the sidebar's **Data Import** section:
   - Supported formats: CSV/Excel/JSON

4. **Create Visualizations** *(Interactive Workflow)*
   - **Chart Configuration**:
     - Select **Chart Type** from dropdown
     - Map columns to:
       - X/Y axes
       - Color groups
       - Size parameters
   - **Customization Panel**:
     - Modify titles/texts
     - Adjust color schemes
     - Configure marker styles
     - Set axis ranges
   - **Rendering Controls**:
     - Toggle `Live Rendering` for instant updates
     - Manual refresh: Click **Render Chart** button
   
   #### ⚠️ Visualization Notes
   - **Styling Sync Issues**:
     - If title/background changes don't apply: 
       1. Use Plotly's native controls (top-right)
       2. Perform it with any zoom action
       3. Click "Auto Scale"
   - **Statistical Lines**:
     - Mean/median lines disabled for datasets <50 rows
   - **Graphical Artifacts**:
     - If residual elements persist after chart switching:
       - Hard refresh: `F5` or `Ctrl + R`

5. **Data Preprocessing**
   - **Data Overview Tab**:
     - File metadata
     - Missing values bar chart
     - Basic statistics
   - **Analysis Report Tab**:
     - Feature distributions
     - Outlier detection
     - Statistical breakdowns
     - Correlation matrices *(planned🚧)*

6. **Data Clustering** *(planned🚧)*

7. **Mathematical Modeling** *(planned🚧)*
   
8. **Color Palette** *(Link)*
   - Find the perfect color palette for your charts

9.  **About ME** *(Link)*
   - Learn more about TiiJeiJ8 (ME!!! 🕶)
    
---

## 🗒️ Future Plans
- **More Features and Improvements**
  - Add more chart types (e.g., heatmap maps, line maps, candlestick charts, 3D charts etc.)
  - Implement data clustering and modeling features
  - Enhance data preprocessing capabilities
  - Improve UI/UX for better user experience
- **Structure Redesign**
  - Plan to use **Vue3, CSS, JS, Flask** to restructure the application

---

## 🤝 Contributing
- Issues and PRs welcome!
- Contact: [tiijeij8@gmail.com](mailto:tiijeij8@gmail.com)

---

## 🙏 Acknowledgments
- Dash & Plotly teams
- Pandas community
- Bootstrap Components contributors

*Created by TiiJeiJ8*

![Star History Chart](https://api.star-history.com/svg?repos=TiiJeiJ8/Fuck-Charts&type=Date)