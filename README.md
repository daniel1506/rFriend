# rFriend

Production URL: https://rfriend.herokuapp.com/

[Google Drive Folder](https://drive.google.com/drive/folders/1iGmTmZUfHpdpOxF3P-ek2LPcFK6tYxkV)

## Requirements

- Node.JS v14
- Yarn 1.22
- MySQL 8

## To run the project locally

### Backend

```zsh
cd backend

# install dependencies
yarn && npx prisma generate

# copy the env template
# please provide your own env variables
cp .env.example .env

# migrate the database
npx prisma migrate dev

# start the development server
yarn dev
```

Then you can visit https://localhost:3000

<details>
    <summary>Shared Development Databsae</summary>
    
    DATABASE_URL="mysql://bf36e27f101630:4423fdd5@us-cdbr-east-05.cleardb.net/heroku_9491a14fb3577a3"
</details>

## To deploy

```zsh
To be updated
```
