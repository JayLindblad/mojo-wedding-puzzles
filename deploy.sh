# build the site
python3 ./compiler/compile.py

# execute the hosting command
wrangler deploy
