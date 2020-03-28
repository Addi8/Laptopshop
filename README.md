# Laptopshop

Laptop Search engine with the following freatures :

1- Vague search system to results with according to its relevance to the searched laptop

2- Boolean search system to show only Laptops with the given criteria

3- The ability to refine the search result using voice queries for one attribute at a time

4- Filter based on Crowd Opinion

## Development server

1- First install elasticsearch from https://www.elastic.co/downloads/elasticsearch and run it

2- Index the data in the dump folder by running (replace path_to_json with the dump folder path)
```
npm install elasticdump -g
elasticdump \
  	--input=path_to_json/products.json \
	--output=http://localhost:9200/products

elasticdump \
  --input=path_to_json/laptops.json \
   --output=http://localhost:9200/laptops
```
2- Create a virtual environment to install all dependancies in it

```
pip install pipenv
pipenv --three
pipenv install

```
and for the Frontend

```npm install```

3- For the Vague search system, navigate to the backend Folder and run

` python3 main.py`
or
`main_binary.py`  for the binary search system.

4- Run `ng start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

5- if you want to activate Alexa, run main_alexa.py 

# Using Alexa

1- Choose any laptop from the search result that will direct to the details page of this laptop

2- To activate Alexa use the command Voice Choice

3- You can use commands like (bigger screen, smaller ram size ,..) to refine the search result using the choosen laptop as refrence.
