import csv

with open('UAE drug list.csv', 'r', encoding='utf-8') as file:
    csv_reader = csv.DictReader(file)
    print("Column names:")
    for i, col in enumerate(csv_reader.fieldnames):
        print(f"{i+1}. '{col}'")