FROM node:lts-iron

WORKDIR /app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/panta5/NAI-Prompt-Randomizer.git /app

RUN cd /app

RUN mkdir /app/dataset

RUN wget https://huggingface.co/datasets/panta5/tags-archive/resolve/main/dataset.tar -O /app/dataset.tar
RUN tar -xvf /app/dataset.tar -C /app/dataset/
RUN rm /app/dataset.tar

RUN npm install

ENV PORT=7860

EXPOSE 7860

CMD ["node", "/app/index.js"]
