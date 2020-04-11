yarn build
gcloud auth login
gcloud config set project fleet-respect-241714
gcloud beta functions deploy botHook --trigger-http --runtime=nodejs10 --region=europe-west1 --memory=128 --env-vars-file=PROD.yaml --allow-unauthenticated
