#!/bin/bash
wget https://huggingface.co/datasets/panta5/tags-archive/resolve/main/dataset.tar -O dataset.tar
tar -xvf dataset.tar -C dataset/
rm dataset.tar
