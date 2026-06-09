# NikChecker Create By: t.me/DavaXbott

NikChecker is a simple web tool to look up available data based on a 16-digit NIK (Nomor Induk Kependudukan).

## URL Access

https://dava-xbott-nik-api.vercel.app/?nik=

## Example Request

https://dava-xbott-nik-api.vercel.app/?nik=1234567890123456

Replace `1234567890123456` with the 16-digit NIK you want to check.

## Usage Notes

- The API currently returns a 400 status if the request is invalid (e.g., NIK is empty or incorrectly formatted).
- Ensure the NIK entered is exactly 16 digits.
- Data availability depends on the data source connected to this API.

## Features

- Look up data by NIK
- Fast response via API endpoint
- Suitable for testing or simple integration

## Technology

- API endpoint: Vercel
- Expected response format: JSON

## License

For educational or personal development purposes. Use responsibly in accordance with applicable regulations.
