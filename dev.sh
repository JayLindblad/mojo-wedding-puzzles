inotifywait -q -m -e close_write ./games/**/* |
while read -r filename event; do
	cd ~/dev/modular-games
	pkill -f "python -m http.server"
  	python3 compile.py
	cd ~/dev/modular-games/_site
	python -m http.server &
done