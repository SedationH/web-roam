function printUser(
  firstName: string,
  lastName: string,
  number: number,
  street: string,
  code: number,
  city: string,
  country: string
): void {
  console.log(
    `${firstName} ${lastName} lives at ${number}, ${street}, ${code} in ${city}, ${country}`
  );
}
printUser(
  "John",
  "Doe",
  48,
  "998 Primrose Lane",
  53718,
  "Madison",
  "United States of America"
);
