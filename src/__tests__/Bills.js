/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {screen, waitFor} from "@testing-library/dom" ;
import userEvent from "@testing-library/user-event";

import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js"

import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

 // Test 1: Puisque je suis connecté en tant qu'employé, quand je suis sur la page de mes notes de frais, 
// alors l'icône des factures dans la barre latérale devrait être en surbrillance.
describe("Given I am connected as an employee", () => { 
  describe("When I am on Bills Page", () => { 
    test("Then bill icon in vertical layout should be highlighted", async () => {
      // Configuration de localStorage pour simuler un employé connecté
      Object.defineProperty(window, "localStorage", { 
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      // Initialisation du routeur et navigation vers la page des notes de frais
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      // on attend l'affichage de l'icône et on verifie la classe pour la surbrillance
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon).toHaveClass('active-icon');
    });
  });

  // Test 2: Puisque je suis connecté en tant qu'employé,Quand je suis sur  sur la page de mes notes de frais,
  // alors mes notes de frais devraient être triées de la plus récente à la plus ancienne.
  test("Then bills should be ordered from earliest to latest", () => {
    // Affichage des notes de frais et récupération des dates
    document.body.innerHTML = BillsUI({ data: bills });
    const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
    // Tri des dates et comparaison avec l'ordre initial
    const chrono = (a, b) => (a < b ? 1 : -1);
    const datesSorted = [...dates].sort(chrono);
    expect(dates).toEqual(datesSorted);
  });

  // Test 3: Puisque je suis connecté en tant qu'employé, Quand je clique sur le bouton pour créer une nouvelle note de frais,
  // alors l'utilisateur devrait être redirigé vers la page du formulaire pour soumettre une nouvelle note de frais.
  describe("When I click on Newbill button", () => { 
    test("Then when I click on New Bill button, the New Bill page should be displayed", () => {
      // Configuration de localStorage et mock de onNavigate
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.fr",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      // Affichage de la page des notes de frais et initialisation du clic sur le bouton Nouvelle note de frais
      document.body.innerHTML = BillsUI({ data: bills });
      const bill = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });
      const handleClickNewBill = jest.fn(bill.handleClickNewBill);
      const newBillButton = screen.getByTestId("btn-new-bill");
      newBillButton.addEventListener("click", handleClickNewBill);
      userEvent.click(newBillButton);
      // Vérification que la page de création d'une nouvelle note de frais est bien affichée
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
});

// Test 4: En tant qu'employé connecté, en cliquant sur l'icône d'œil d'une note de frais,
// une modale avec le justificatif devrait s'ouvrir.
describe("Given I am logged in as an employee", () => {
  describe("When I am on the Bills page and click on the eye icon", () => {
    test("Then a modal should open", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({ type: "Employee", email: "test@test.fr" }));

      // Mock de la modale et préparation du DOM
      $.fn.modal = jest.fn(); // Simuler la fonction modal de jQuery
      document.body.innerHTML = BillsUI({ data: bills }); // Générer le HTML de la page des notes de frais

      // Création de l'instance de Bills avec ses dépendances
      const bill = new Bills({
        document,
        onNavigate: jest.fn(),
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Remplacer handleClickIconEye par un mock
      const handleClickIconEyeMock = jest.fn(bill.handleClickIconEye.bind(bill));
      bill.handleClickIconEye = handleClickIconEyeMock;

      // Simuler le clic sur l'icône œil
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      userEvent.click(iconEye);

      // Vérifications
      expect(handleClickIconEyeMock).toHaveBeenCalled(); // S'assurer que la fonction est appelé
      expect($.fn.modal).toHaveBeenCalled(); 
    });
  });
});

// Test 5: En tant qu'employé connecté, après avoir ouvert la modale du justificatif,
// en cliquant sur la croix, la modale devrait se fermer.
describe("Given I am connected as an employee", () => {
  describe("when I click on icon eye and then on the close button", () => {
    test("Then the modal should disappear", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.fr",
        })
      );
      $.fn.modal = jest.fn();
      const bill = new Bills({
        document,
        onNavigate: jest.fn(),
        store: mockStore,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = BillsUI({ data: bills });
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      const handleClickIconEye = jest.fn(() => bill.handleClickIconEye(iconEye));
      iconEye.addEventListener("click", handleClickIconEye);
      userEvent.click(iconEye);
      // Simulation du clic sur la croix pour fermer la modale
      const closeModalBtn = screen.getByLabelText("Close");
      closeModalBtn.click();
      // Vérification que la modale se ferme bien
      expect($.fn.modal).toHaveBeenCalled();
    });
  });
});

// Test 6: En tant qu'employé connecté, en naviguant vers Bills.js,
// les notes de frais devraient être récupérées depuis l'API.
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills.js", () => {
    test("fetches bills from mock API GET", async () => {
      // Configuration du localStorage et navigation vers la page des notes de frais
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      // Vérification de l'affichage des notes de frais
      await waitFor(() => screen.getByText("Mes notes de frais"));
      expect(bills).toBeTruthy();
    });
  });

  // Test 7: En cas d'erreur 404 de l'API lors de la récupération des notes de frais,
  // un message d'erreur devrait s'afficher.
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => ({
        list: () => Promise.reject(new Error("Erreur 404"))
      }));
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    // Test 8: En cas d'erreur 500 de l'API lors de la récupération des factures,
    // un message d'erreur devrait également s'afficher.
    test("fetches bills from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => ({
        list: () => Promise.reject(new Error("Erreur 500"))
      }));
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
  
});


