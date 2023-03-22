#!/bin/bash
# (in Ubuntu '/bin/sh' is wrong)
for f in *.png; do mv "$f" "${f:3}"; done;
