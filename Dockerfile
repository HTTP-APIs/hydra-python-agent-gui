FROM python:3

WORKDIR /app

COPY ./requirements.txt requirements.txt

RUN pip install -U pip && pip install --upgrade pip setuptools \
    && pip install -r requirements.txt && pip install python-engineio==3.11.2

COPY  . /app

ENV PYTHONPATH "${PYTHONPATH}:/app"

ENV MESSAGE "Hail Hydra"