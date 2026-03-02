FROM python:3.11.14-slim
WORKDIR /app
COPY requirements.txt . 
COPY pyproject.toml .
RUN mkdir -p log
RUN python -m venv .venv && \ 
    . .venv/bin/activate && \
    pip install --no-cache-dir --upgrade wheel && \ 
    # anti-vulnerability for python:3.11.14-slim
    pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y curl \
    && curl -sL https://taskfile.dev/install.sh | sh \
    && mv bin/task /usr/local/bin/task
COPY . .
CMD [".venv/bin/python", "main.py"]

