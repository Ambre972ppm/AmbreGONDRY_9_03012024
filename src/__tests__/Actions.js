/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import Actions from "../views/Actions.js";
import '@testing-library/jest-dom/extend-expect';

// Test 1 : Étant donné que je suis connecté en tant qu'employé et que je suis sur la page des notes de frais,
// alors je devrais voir l'icône pour visualiser une facture (l'œil).
describe('Given I am connected as an Employee', () => {
  describe('When I am on Bills page and there are bills', () => {
    test(('Then, it should render icon eye'), () => {
      const html = Actions();
      document.body.innerHTML = html;
      expect(screen.getByTestId('icon-eye')).toBeTruthy();
    });
  });

  // Test 2 : Lorsque je suis sur la page des notes de frais et qu'il existe des factures avec une URL pour le fichier,
  // alors cette URL devrait être enregistrée dans l'attribut personnalisé data-bill-url de l'icône pour visualiser une facture.
  describe('When I am on Bills page and there are bills with url for file', () => {
    test(('Then, it should save given url in data-bill-url custom attribute'), () => {
      const url = '/fake_url';
      const html = Actions(url);
      document.body.innerHTML = html;
      expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', url);
    });
  });
});
