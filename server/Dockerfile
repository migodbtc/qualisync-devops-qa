FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt . 
COPY pyproject.toml .
RUN mkdir -p log
RUN python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
COPY . .
CMD [".venv/bin/python", "main.py"]

