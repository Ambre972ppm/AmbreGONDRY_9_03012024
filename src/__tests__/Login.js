/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { waitFor } from "@testing-library/dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { fireEvent, screen } from "@testing-library/dom";

import mockStore from "../__mocks__/store";

jest.mock("../app/store", () => mockStore);

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn()
  },
  writable: true
});

// Préparation du test et mock de onNavigate
const onNavigateMock = jest.fn();

describe("Login Component", () => {
  beforeEach(() => {
    // Réinitialiser le contenu HTML pour chaque test
    document.body.innerHTML = LoginUI();

    // Réinitialiser les mocks
    onNavigateMock.mockReset();
  });

  // Test 1 : Je suis un visiteur non connecté, je ne remplie pas les champs et je soumet le formulaire
  // de connexion en tant qu'employee, je devrais donc rester sur la page de connexion
  describe("Given that I am a user on login page", () => {
    describe("When I do not fill fields and I click on employee button Login In", () => {
      test("Then It should renders Login page", () => {
        document.body.innerHTML = LoginUI();
  
        const inputEmailUser = screen.getByTestId("employee-email-input");
        expect(inputEmailUser.value).toBe("");
  
        const inputPasswordUser = screen.getByTestId("employee-password-input");
        expect(inputPasswordUser.value).toBe("");
  
        const form = screen.getByTestId("form-employee");
        const handleSubmit = jest.fn((e) => e.preventDefault());
  
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(screen.getByTestId("form-employee")).toBeTruthy();
      });
    });
  
    // Test 2 : Je suis un visiteur non connecté, je remplis des champs dans un format incorrect et je soumet le formulaire
    // de connexion en tant qu'employee, je devrais donc rester sur la page de connexion
    describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
      test("Then It should renders Login page", () => {
        document.body.innerHTML = LoginUI();
  
        const inputEmailUser = screen.getByTestId("employee-email-input");
        fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
        expect(inputEmailUser.value).toBe("pasunemail");
  
        const inputPasswordUser = screen.getByTestId("employee-password-input");
        fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
        expect(inputPasswordUser.value).toBe("azerty");
  
        const form = screen.getByTestId("form-employee");
        const handleSubmit = jest.fn((e) => e.preventDefault());
  
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(screen.getByTestId("form-employee")).toBeTruthy();
      });
    });
  
    // Test 3 : Je suis un visiteur non connecté, je remplis correctement les champs et je soumet le formulaire
    // de connexion en tant qu'employee, je devrais être identifié et arriver sur mes notes de frais
    describe("When I do fill fields in correct format and I click on employee button Login In", () => {
      test("Then I should be identified as an Employee in app and I should be redirected to my bills page", () => {
        document.body.innerHTML = LoginUI();
        const inputData = {
          email: "johndoe@email.com",
          password: "azerty",
        };
  
        const inputEmailUser = screen.getByTestId("employee-email-input");
        fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
        expect(inputEmailUser.value).toBe(inputData.email);
  
        const inputPasswordUser = screen.getByTestId("employee-password-input");
        fireEvent.change(inputPasswordUser, {
          target: { value: inputData.password },
        });
        expect(inputPasswordUser.value).toBe(inputData.password);
  
        const form = screen.getByTestId("form-employee");
  
        // localStorage should be populated with form data
        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: jest.fn(() => null),
            setItem: jest.fn(() => null),
          },
          writable: true,
        });
  
        // we have to mock navigation to test it
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
  
        let PREVIOUS_LOCATION = "";
  
        const store = mockStore;
  
        const login = new Login({
          document,
          localStorage: window.localStorage,
          onNavigate,
          PREVIOUS_LOCATION,
          store,
        });
  
        const handleSubmit = jest.fn(login.handleSubmitEmployee);
        login.login = jest.fn().mockResolvedValue({});
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
        expect(window.localStorage.setItem).toHaveBeenCalled();
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify({
            type: "Employee",
            email: inputData.email,
            password: inputData.password,
            status: "connected",
          })
        );
      });

      test("Successful login navigates to bills page", async () => {
        const login = new Login({
          document,
          onNavigate: onNavigateMock,
          localStorage: window.localStorage,
          store: { login: jest.fn().mockResolvedValue({}) } // Simuler une connexion réussie
        });
    
        // Simuler les entrées de l'utilisateur et la soumission du formulaire
        fireEvent.change(screen.getByTestId("employee-email-input"), { target: { value: "employee@example.com" } });
        fireEvent.change(screen.getByTestId("employee-password-input"), { target: { value: "password" } });
        fireEvent.click(screen.getByTestId("employee-login-button"));
    
        await waitFor(() => {
          // Vérifier que la navigation a été appelée avec la bonne route
          expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
        });
      });
  
    });
  });
  
   // Test 4 : Je suis un visiteur non connecté, je ne remplie pas les champs et je soumet le formulaire
  // de connexion en tant qu'administrateur, je devrais donc rester sur la page de connexion
  describe("Given that I am a user on login page", () => {
    describe("When I do not fill fields and I click on admin button Login In", () => {
      test("Then It should renders Login page", () => {
        document.body.innerHTML = LoginUI();
  
        const inputEmailUser = screen.getByTestId("admin-email-input");
        expect(inputEmailUser.value).toBe("");
  
        const inputPasswordUser = screen.getByTestId("admin-password-input");
        expect(inputPasswordUser.value).toBe("");
  
        const form = screen.getByTestId("form-admin");
        const handleSubmit = jest.fn((e) => e.preventDefault());
  
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(screen.getByTestId("form-admin")).toBeTruthy();
      });
    });
  
    // Test 5 : Je suis un visiteur non connecté, je remplis des champs dans un format inccorect et je soumet le formulaire
    // de connexion en tant qu'administrateur, je devrais donc rester sur la page de connexion
    describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
      test("Then It should renders Login page", () => {
        document.body.innerHTML = LoginUI();
  
        const inputEmailUser = screen.getByTestId("admin-email-input");
        fireEvent.change(inputEmailUser, { target: { value: "pasunemail" } });
        expect(inputEmailUser.value).toBe("pasunemail");
  
        const inputPasswordUser = screen.getByTestId("admin-password-input");
        fireEvent.change(inputPasswordUser, { target: { value: "azerty" } });
        expect(inputPasswordUser.value).toBe("azerty");
  
        const form = screen.getByTestId("form-admin");
        const handleSubmit = jest.fn((e) => e.preventDefault());
  
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(screen.getByTestId("form-admin")).toBeTruthy();
      });
    });
  
    // Test 6 : Je suis un visiteur non connecté, je remplis correctement les champs et je soumet le formulaire
    // de connexion en tant qu'administritateur, je devrais être identifié et arriver sur mon Dashboard
    describe("When I do fill fields in correct format and I click on admin button Login In", () => {
      test("Then I should be identified as an HR admin in app, I should be redirected to my Dashboard page", () => {
        document.body.innerHTML = LoginUI();
        const inputData = {
          type: "Admin",
          email: "johndoe@email.com",
          password: "azerty",
          status: "connected",
        };
  
        const inputEmailUser = screen.getByTestId("admin-email-input");
        fireEvent.change(inputEmailUser, { target: { value: inputData.email } });
        expect(inputEmailUser.value).toBe(inputData.email);
  
        const inputPasswordUser = screen.getByTestId("admin-password-input");
        fireEvent.change(inputPasswordUser, {
          target: { value: inputData.password },
        });
        expect(inputPasswordUser.value).toBe(inputData.password);
  
        const form = screen.getByTestId("form-admin");
  
        Object.defineProperty(window, "localStorage", {
          value: {
            getItem: jest.fn(() => null),
            setItem: jest.fn(() => null),
          },
          writable: true,
        });
  
        // we have to mock navigation to test it
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
  
        let PREVIOUS_LOCATION = "";
  
        const store = mockStore;
  
        const login = new Login({
          document,
          localStorage: window.localStorage,
          onNavigate,
          PREVIOUS_LOCATION,
          store,
        });
  
        const handleSubmit = jest.fn(login.handleSubmitAdmin);
        login.login = jest.fn().mockResolvedValue({});
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
        expect(window.localStorage.setItem).toHaveBeenCalled();
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify({
            type: "Admin",
            email: inputData.email,
            password: inputData.password,
            status: "connected",
          })
        );
      });
  
    });
  
  
  });

});


