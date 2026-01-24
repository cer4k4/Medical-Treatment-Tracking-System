
From docker.arvancloud.ir/node

WORKDIR /app

COPY . .

RUN npm config set registry https://mirror-npm.runflare.com

RUN npm install

EXPOSE 4000

CMD ["npm","run","dev"]
