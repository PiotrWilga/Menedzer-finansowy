# Aplikacja do zarządzania kontami i transakcjami

To prosta aplikacja webowa, która umożliwia użytkownikowi tworzenie i zarządzanie kontami finansowymi oraz przypisywanie do nich transakcji (wydatków lub przychodów). Każdy użytkownik posiada swoje konto, do którego przypisane są jego dane i operacje. System pozwala tworzyć wiele kont (np. „Konto główne”, „Oszczędnościowe”), a każde z nich może zawierać wiele transakcji. Transakcje mają typ (przychód/wydatek), tytuł, kwotę oraz datę. Po zalogowaniu użytkownik widzi panel z listą kont oraz może przejść do widoku konkretnego konta, gdzie znajdzie szczegóły transakcji oraz saldo. Aplikacja posiada też rejestrację, logowanie, panel użytkownika, nawigację oraz formularze umożliwiające edycję danych. Kod został napisany z myślą o prostocie, przejrzystości i łatwym rozwijaniu.

---

## Technologie użyte w projekcie

- Node.js, Express.js
- MongoDB – baza danych
- EJS – szablony HTML generowane po stronie serwera
- express-session – do zarządzania sesjami użytkowników
- dotenv – zarządzanie danymi konfiguracyjnymi w `.env`
- CSS – podstawowy, responsywny wygląd

---

## Jak uruchomić projekt?

1. **Edytuj plik `.env`** w katalogu głównym, by podać URI do bazy danych :

   ```env
   MONGODB_URI=mongodb+srv://<login>:<haslo>@<klaster>.mongodb.net/<nazwa_bazy>
   ```

2. **Zainstaluj zależności:**

   ```npm install
   ```

3. **Uruchom aplikację:**

   ```npm start
   ```

4. Otwórz przeglądarkę i wejdź na: `http://localhost:3000`
