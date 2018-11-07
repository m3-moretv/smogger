FROM node:carbone
WORKDIR /usr/app
COPY lib lib
CMD node lib/index.js
