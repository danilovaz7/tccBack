FROM node:24.0

RUN config set unsafe-perm true

COPY . .

RUN npm i

CMD ["npm", "run", "start:prod"]
