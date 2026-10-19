# Feefo exercises

This repo has two exercises:

1. **Job Title Normaliser** (Java), in the root folder
2. **Product Rating widget** (React), in `2nd exercise/`

## 1. Job Title Normaliser

You need JDK 17 or newer. Maven is not needed, because the Maven wrapper (`mvnw`) is included.

From the root folder:

```bash
./mvnw test                  # run the tests
./mvnw -q compile exec:java  # run the sample job titles
./mvnw -q compile exec:java -Dexec.args="'Senior Quantity Surveyor' 'Lead architect'"
```

On Windows, use `mvnw.cmd` instead of `./mvnw`.

## 2. Product Rating widget

You need Node 18 or newer.

```bash
cd "2nd exercise"
npm install
npm run dev    # open http://localhost:5173
npm test       # run the tests
```
