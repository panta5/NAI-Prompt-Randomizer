@echo off
curl -o dataset.tar https://huggingface.co/datasets/panta5/tags-archive/resolve/main/dataset.tar
tar -xf dataset.tar -C dataset\
del dataset.tar
