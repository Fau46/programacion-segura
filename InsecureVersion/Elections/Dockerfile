FROM python:3.7

WORKDIR /usr/src/app/
COPY requirements.txt ./
COPY run.sh ./

# RUN dos2unix ./run.sh
RUN chmod +x ./run.sh

ENV PYTHONPATH=.
ENV PYTHONUNBUFFERED=1
EXPOSE 42423

RUN ["./run.sh", "setup"]

COPY . ./

# RUN dos2unix ./run.sh
RUN chmod +x ./run.sh

CMD ["./run.sh"]
