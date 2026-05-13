Setup and run instructions for the Arch Flask app

1. Create .env
   - Copy `.env.example` to `.env` inside `SRC/Arch` and update values.

   Windows PowerShell:
   ```powershell
   cd SRC\Arch
   copy .env.example .env
   ```

2. Ensure MySQL is running on the configured host/port and the database exists.
   - Create the database and tables using `Design/database_schema.sql` if needed.

3. Create and activate virtual environment (if not already):
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

4. Run the app:
   ```powershell
   cd SRC\Arch
   .\.venv\Scripts\python.exe app.py
   ```

Optional: If you don't have MySQL locally, set up a remote MySQL server or use Docker:

Docker quick start:
```powershell
docker run --name mysql-local -e MYSQL_ROOT_PASSWORD=your_password -e MYSQL_DATABASE=hotel_management -p 3306:3306 -d mysql:8.0
```

Then update `.env` with the password and host if needed.
