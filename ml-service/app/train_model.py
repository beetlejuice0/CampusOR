import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import os
from pathlib import Path

# 1. Load Dataset
BASE_DIR = Path(__file__).resolve().parent.parent
csv_path = BASE_DIR / "campusor_wait_time_mock.csv"

print(f"Loading data from: {csv_path}")
try:
    df = pd.read_csv(csv_path)
    print(f"Data loaded successfully. Shape: {df.shape}")
except FileNotFoundError:
    print("Error: CSV file not found. Please check the path.")
    exit()

# 2. Preprocessing & Feature Selection
# The issue explicitly requests these input features
features = ['tokensAhead', 'activeCounters', 'hourOfDay', 'dayOfWeek', 'avgServiceTime']
target = 'actualWaitMinutes'

print("\nFeatures used for training:")
print(features)

X = df[features]
y = df[target]

# Split data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Model Training
# Using Random Forest as a robust baseline
print("\nTraining Random Forest Regressor...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 4. Evaluation
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))

print("-" * 30)
print("Model Evaluation Metrics:")
print(f"Mean Absolute Error (MAE): {mae:.2f} minutes")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f} minutes")
print("-" * 30)

# 5. Save the Model
model_filename = Path(__file__).resolve().parent / "wait_time_model.pkl"
joblib.dump(model, model_filename)
print(f"Trained model saved to: {model_filename}")