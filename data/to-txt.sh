for i in *.pdf; do textract $i > ./dist-txt/$i.txt;  done
