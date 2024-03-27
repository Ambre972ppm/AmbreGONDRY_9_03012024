/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {screen, waitFor, fireEvent} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js";

import {ROUTES_PATH} from "../constants/routes.js";

import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

beforeEach(() => {
    document.body.innerHTML = NewBillUI();
    window.onNavigate = jest.fn();
});

afterEach(() => {
    document.body.innerHTML = ''; 
})


describe("Given I am logged in as an employee", () => {
    describe("When I am on NewBill page", () => {
        // Test 1 : Puisque Je suis connecté en tant qu'employée, Quand je suis sur la page 
        // nouvelle note de frais, alors je devrais voir le formulaire de création d'une nouvelle note de frais.
        test("Then the new bill form should be rendered", () => {
            expect(screen.getByTestId("form-new-bill")).toBeTruthy();
        });

        // Test 2 : Puisque Je suis connecté en tant qu'employée, Quand je suis sur la page 
        // nouvelle note de frais, alors l'icone enveloppe devrais être en surbrillance
        test("Then the mail icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(window, "localStorage", { 
                value: localStorageMock,
              });
              window.localStorage.setItem( // on simule la connexion d'un utilisateur "employé"
                "user",
                JSON.stringify({
                  type: "Employee",
                })
              );
              const root = document.createElement("div");
              root.setAttribute("id", "root");
              document.body.append(root);
              router();
              window.onNavigate(ROUTES_PATH.NewBill);
              await waitFor(() => screen.getByTestId("icon-mail"));
              const iconMail = screen.getByTestId("icon-mail");
        
              expect(iconMail).toBeTruthy;
              expect(iconMail).toHaveClass('active-icon'); 
        });

        // Test 3 : Puisque je suis connecté en tant qu'employé et que je suis sur la page de création d'une nouvelle note de frais,
        // quand je télécharge un fichier image valide dans le champ de téléchargement de fichier, alors le fichier doit être accepté et chargé
        describe("When I upload a file with a valid format", () => {
            test("Then the file should be uploaded successfully", async () => {
                const fileInput = screen.getByTestId("file");
                const validFile = new File(["facture"], "facture.png", {type: "image/png"});

                await userEvent.upload(fileInput, validFile);
                expect(fileInput.files[0]).toStrictEqual(validFile);
                expect(fileInput.files.item(0).name).toBe("facture.png");
            });
        });

        // Test 4 : Puisque je suis sur la page nouvelle note de frais,  
        //  Quand je charge un fichier au mauvais format alors il n'est pas accepté
        describe("When I upload a file with the wrong format", () => {
            test("Then the file should not be accepted, and an error message should be shown", async () => {
                const newBill = new NewBill({
                    document,
                    onNavigate: window.onNavigate,
                    store: mockStore,
                    localStorage: window.localStorage,
                });
                
                jest.spyOn(window, 'alert').mockImplementation(() => {});
                
                const fileInput = screen.getByTestId("file");
                const invalidFile = new File(["facture"], "facture.pdf", {type: "application/pdf"});

                const filePath = fileInput.value.split(/\\/g)
                const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i; // Extensions autorisées
    
                if (!allowedExtensions.exec(filePath)) {
                    alert('Veuillez télécharger un fichier image valide. Les extensions autorisées sont .jpg, .jpeg et .png');
                    fileInput.value = ''; // Réinitialise le champ du fichier
                    return false;
                }

			    const handleChangeFile = jest.fn(() => newBill.handleChangeFile);

                fileInput.addEventListener("change", handleChangeFile);
                fireEvent.change(fileInput, { target: invalidFile });

                await userEvent.upload(fileInput, invalidFile);
                expect(filePath).toBe(fileInput.value.split(/\\/g));
                expect(fileName).toBe(filePath[filePath.length-1]);
                expect(fileInput.files[0]).toStrictEqual(invalidFile);
                expect(fileInput.files.item(0).name).toBe("facture.pdf");
                expect(handleChangeFile).toHaveBeenCalled();
                await waitFor(() => {
                    expect(window.alert).toHaveBeenCalled()
                    expect(fileInput.value).toBe("");
                })
                jest.resetAllMocks();
            });
        });
       
        // Test 5 : Puisque je suis sur la page nouvelle note de frais,  
        //  Quand je charge un fichier au bon format et que je soumet le formulaire, alors je suis redirigé vers mes notes de frais
        describe("When I submit the form with an image file", () => {
            test("Then the form should be submitted and I should be redirected to the Bills page", async () => {
                const onNavigate = jest.fn((pathname) => {
                    document.body.innerHTML = ROUTES_PATH.NewBill;
                });

                const newBill = new NewBill({
                    document,
                    onNavigate,
                    store: mockStore,
                    localStorage: window.localStorage,
                });

                const submit = screen.getByTestId("form-new-bill");
                const input = screen.getByTestId("file");
                const file = new File(["image"], "image.jpg", {type: "image/jpg"});

                await userEvent.upload(input, file);
                await fireEvent.submit(submit);

                expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.Bills);
            });
        });

        describe("When an error occurs on API", () => {
            beforeEach(() => {
                jest.spyOn(mockStore, "bills").mockImplementationOnce(() => ({
                    create: () => Promise.reject(new Error("Erreur 500")),
                }));
            });

            test("Then fetches bills from an API and fails with 500 error", async () => {
                    const postSpy = jest.spyOn(console, "error");
    
                    const store = {
                        bills: jest.fn(() => newBill.store),
                        create: jest.fn(() => Promise.resolve({})),
                        update: jest.fn(() => Promise.reject(new Error("500"))),
                    };
    
                    const newBill = new NewBill({ document, onNavigate, store, localStorage });
                    newBill.isImgFormatValid = true;
    
                    // Submit form
                    const form = screen.getByTestId("form-new-bill");
                    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
                    form.addEventListener("submit", handleSubmit);
    
                    fireEvent.submit(form);
                    await new Promise(process.nextTick);
                    expect(postSpy).toBeCalledWith(new Error("500"));
            });
        });
    });
});
