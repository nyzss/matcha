process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const accounts = [
    {
        username: "ye",
        email: "ye@gmail.com",
        password: "password123",
        birthDate: "1977-06-08",
        firstName: "Kanye",
        lastName: "West",
    },
    {
        username: "travisscott",
        email: "travisscott@gmail.com",
        password: "password123",
        birthDate: "1991-04-30",
        firstName: "Travis",
        lastName: "Scott",
    },
    {
        username: "kidcudi",
        email: "kidcudi@gmail.com",
        password: "password123",
        birthDate: "1984-01-30",
        firstName: "Scott",
        lastName: "Mescudi",
    },
    {
        username: "mfdoom",
        email: "mfdoom@gmail.com",
        password: "password123",
        birthDate: "1971-07-13",
        firstName: "Daniel",
        lastName: "Dumile",
    },
    {
        username: "metroboomin",
        email: "metroboomin@gmail.com",
        password: "password123",
        birthDate: "1993-09-16",
        firstName: "Leland",
        lastName: "Wayne",
    },
    {
        username: "badgalriri",
        email: "badgalriri@gmail.com",
        password: "password123",
        birthDate: "1988-02-20",
        firstName: "Robyn",
        lastName: "Fenty",
    },
    {
        username: "beyonce",
        email: "beyonce@gmail.com",
        password: "password123",
        birthDate: "1981-09-04",
        firstName: "Beyoncé",
        lastName: "Knowles",
    },
    {
        username: "ladygaga",
        email: "ladygaga@gmail.com",
        password: "password123",
        birthDate: "1986-03-28",
        firstName: "Stefani",
        lastName: "Germanotta",
    },
    {
        username: "taylorswift",
        email: "taylorswift@gmail.com",
        password: "password123",
        birthDate: "1989-12-13",
        firstName: "Taylor",
        lastName: "Swift",
    },
    {
        username: "selenagomez",
        email: "selenagomez@gmail.com",
        password: "password123",
        birthDate: "1992-07-22",
        firstName: "Selena",
        lastName: "Gomez",
    },
    {
        username: "okoca",
        email: "oknakoca@gmail.com",
        password: "password123",
        birthDate: "2004-01-11",
        firstName: "Okan",
        lastName: "Koca",
    },
];

Promise.all(
    accounts.map(async (acc) => {
        return await fetch("http://localhost:5173/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(acc),
        });
    })
)
    .then((response) => {
        return Promise.all(response.map((res) => res.json()));
    })
    .then((json) => {
        console.log(json);
    });
