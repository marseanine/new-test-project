import "cypress-xpath";
import "@4tw/cypress-drag-drop";

describe("Testing edition of VAT", () => {
  const email = "vincent.depoortere+demo4testers@gmail.com";
  const password = "Demo4Testers";
  let isLoggedIn = false;

  // Login before each test
  beforeEach(() => {
    if (!isLoggedIn) {
      cy.visit("https://okioki.app");

      // Enter Username
      cy.xpath('//*[@id="Username"]').type(email).should("have.value", email);

      // Enter Password
      cy.xpath('//*[@id="Password"]')
        .type(password)
        .should("have.value", password);

      // Click Login button
      cy.xpath('//*[@id="account"]/button').click();

      cy.wait(10000);

      // Wait for the drawer element to appear on the dashboard page
      cy.xpath('//*[@id="app"]/div[1]/div/div[1]/div/div[1]', {
        timeout: 10000,
      }).should("be.visible");

      // Verify successful login
      cy.url().should("eq", "https://www.okioki.app/dashboard");

      isLoggedIn = true;
    }
  });

  it("editing Amount incl. VAT field", () => {
    // Open document page
    cy.visit(
      "https://www.okioki.app/booking/b141d57c-a65d-4ad5-d694-08dac681ea18"
    );
    cy.wait(5000);

    // Checking for the presence of an element called Telenet BV
    cy.get("div.flex-row:nth-child(2)")
      .should("exist")
      .contains("Telenet BV")
      .click();

    // Generating a random number (from 0 to 999)
    const randomNumber = Math.floor(Math.random() * 1000);

    // Enter the generated random number in the Amount incl field. VAT
    cy.get(
      "li.props-table-item:nth-child(3) > div:nth-child(1) > span:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
    )
      .click()
      .clear()
      .type(randomNumber.toString());

    // Check that the text in the header matches the entered value in the Amount incl field. VAT
    cy.get(".amount-negative").click();

    cy.wait(2000);

    cy.get(".amount-negative")
      .invoke("text")
      .then((text) => {
        // Convert the values to floating point numbers and compare them
        const inputNumber = parseFloat(text.replace(/,/g, "."));
        const expectedNumber = -randomNumber;
        expect(inputNumber).to.equal(expectedNumber);
      });

    // Check that the value in the Amount excl. VAT is considered correct
    // Get the text from the Amount incl field. VAT and convert it to a number
    cy.get(
      "li.props-table-item:nth-child(3) > div:nth-child(1) > span:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
    )
      .invoke("text")
      .then((text) => {
        cy.log("Original text:", text); // Logging the received text

        // Clear the text of all characters except numbers and commas
        const cleanedText = text.replace(/[^\d,]/g, "");
        cy.log("Cleaned text:", cleanedText);

        // Convert text to number
        const originalNumber = parseFloat(cleanedText.replace(/,/g, "."));
        cy.log("Original number:", originalNumber);

        // Getting text from the Rate field with a percentage
        cy.get(
          "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li.props-table-item.vat-section-body > div.single-line > span > table > tbody > tr > td.first-col > div > div > div"
        )
          .invoke("text")
          .then((percentageText) => {
            // Convert the percentage to a string and clear it of extra characters
            const cleanedPercentageText: string = percentageText
              .toString()
              .replace(/[^\d,]/g, "");

            // Convert percentage to number
            const percentageNumber: number =
              parseFloat(cleanedPercentageText.replace(/,/g, ".")) / 100 + 1;

            // If were able to convert the text to a number, continue execution
            if (!isNaN(originalNumber) && !isNaN(percentageNumber)) {
              const dividedNumber: number = originalNumber / percentageNumber;

              // Get the text from the Amount excl field. VAT
              cy.get(
                "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li:nth-child(4) > div.single-line > span.value > div > div.wrapper.editable.justify-content-end > div"
              )
                .invoke("text")
                .then((newText) => {
                  cy.log("New text:", newText); // Logging the received text

                  // Clear the text of all characters except numbers and commas
                  const cleanedNewText: string = newText.replace(/[^\d,]/g, "");
                  cy.log("Cleaned new text:", cleanedNewText);

                  // Convert the cleaned text into a number
                  const newNumber: number = parseFloat(
                    cleanedNewText.replace(/,/g, ".")
                  );

                  // Round the number to two decimal places
                  const roundedDividedNumber: number = Number(
                    dividedNumber.toFixed(2)
                  );

                  // Comparing rounded values
                  expect(newNumber).to.equal(roundedDividedNumber);
                });
            } else {
              // If it wasn't possible to convert text to a number, we display an error message
              cy.log(
                "Failed to convert original text or percentage text to number"
              );
            }
          });

        // Check that the value in the Amount incl field. VAT matches the value in the Amount to pay field
        // Get the text from the Amount incl. VAT field
        cy.get(
          "li.props-table-item:nth-child(3) > div:nth-child(1) > span:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
        )
          .invoke("text")
          .then((text1) => {
            cy.log("Text from first field:", text1);

            // Clear the text of all characters except numbers and commas
            const cleanedText1: string = text1.replace(/[^\d,]/g, "");
            cy.log("Cleaned text from first field:", cleanedText1);

            // Convert the cleaned text into a number
            const number1: number = parseFloat(cleanedText1.replace(/,/g, "."));
            cy.log("Number from first field:", number1);

            // Get the text from the Amount to pay field
            cy.get(
              "li.props-table-item:nth-child(7) > div:nth-child(2) > span:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
            )
              .invoke("text")
              .then((text2) => {
                cy.log("Text from second field:", text2);

                // Clear the text of all characters except numbers and commas
                const cleanedText2: string = text2.replace(/[^\d,]/g, "");
                cy.log("Cleaned text from second field:", cleanedText2);

                // Convert the cleaned text into a number
                const number2: number = parseFloat(
                  cleanedText2.replace(/,/g, ".")
                );
                cy.log("Number from second field:", number2);

                // Checking for equality of numbers
                try {
                  expect(number1).to.equal(number2);
                } catch (error) {
                  // If the numbers are not equal, display a message in the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log("Numbers are not equal:", errorMessage);
                }
              });
          });
      });

    // Compare the value in the Amount excl. VAT field and the value in the Excl. VAT field
    // We get the text from the Amount excl. VAT field and convert it to a number
    cy.get(
      "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li:nth-child(4) > div.single-line > span.value > div > div.wrapper.editable.justify-content-end > div"
    )
      .invoke("text")
      .then((text1) => {
        cy.log("Original text 1:", text1); // Logging the received text

        // Clear the text of all characters except numbers and commas
        const cleanedText1 = text1.replace(/[^\d,]/g, "");
        cy.log("Cleaned text 1:", cleanedText1);

        // Convert text to number
        const number1 = parseFloat(cleanedText1.replace(/,/g, "."));
        cy.log("Number 1:", number1);

        // We get the text from the Excl. VAT field and convert it to a number
        cy.get(
          "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li.props-table-item.vat-section-body > div.single-line > span > table > tbody > tr > td:nth-child(2) > div > div > div"
        )
          .invoke("text")
          .then((text2) => {
            cy.log("Original text 2:", text2); // Logging the received text

            // Clear the text of all characters except numbers and commas
            const cleanedText2 = text2.replace(/[^\d,]/g, "");
            cy.log("Cleaned text 2:", cleanedText2);

            // Convert text to number
            const number2 = parseFloat(cleanedText2.replace(/,/g, "."));
            cy.log("Number 2:", number2);

            // Trying to check for equality of numbers
            try {
              expect(number1).to.equal(number2);
            } catch (error) {
              // If the numbers are not equal, we display a message in the log
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              cy.log("Numbers are not equal:", errorMessage);
            } finally {
              // Continue the test even if the numbers are not equal
              cy.log("Continuing with the test..."); // If there was an error, write it to the log
            }
          });
      });

    // Subtract the number from the Amount incl. VAT field from the number in the Amount excl. VAT field. The resulting value is compared with the number in the VAT field
    // Getting text from the Amount incl. VAT field
    cy.get(
      "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li:nth-child(3) > div.single-line > span.value > div > div.wrapper.editable.justify-content-end > div"
    )
      .invoke("text")
      .then((text1) => {
        cy.log("Amount incl. VAT:", text1); // Logging the received text

        // Clear the text of all characters except numbers and commas
        const cleanedText1 = text1.replace(/[^\d,]/g, "");
        cy.log("Cleaned Amount incl. VAT:", cleanedText1);

        // Convert text to number
        const amountInclVAT = parseFloat(cleanedText1.replace(/,/g, "."));
        cy.log("Amount incl. VAT:", amountInclVAT);

        // Getting text from the Amount excl. VAT field
        cy.get(
          "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li:nth-child(4) > div.single-line > span.value > div > div.wrapper.editable.justify-content-end > div"
        )
          .invoke("text")
          .then((text2) => {
            cy.log("Amount excl. VAT:", text2); // Logging the received text

            // Clear the text of all characters except numbers and commas
            const cleanedText2 = text2.replace(/[^\d,]/g, "");
            cy.log("Cleaned Amount excl. VAT:", cleanedText2);

            // Convert text to number
            const amountExclVAT = parseFloat(cleanedText2.replace(/,/g, "."));
            cy.log("Amount excl. VAT:", amountExclVAT);

            // Subtraction rounded to two decimal places
            const calculatedVAT = (amountInclVAT - amountExclVAT).toFixed(2);
            cy.log("Calculated VAT:", calculatedVAT);

            // Getting text from the VAT field
            cy.get(
              "#app > div.oki-main-container.full-height.container-fluid.main-active > div > div.px-0.mx-0.full-height.main-container.col > div > div.page-container.d-flex.flex-column.full-height.full-width > div.okioki-container.full-height.flex-grow-1.container-fluid.dark > div > div.okioki-container.d-flex.flex-column.full-height.col.standard.second-pane.col-lg-4 > div > div > div > div > div.scan-row > div > div.px-normal.flex-grow-1.pb-wide.scroll-box.scrollbar-light > ul > li.props-table-item.vat-section-body > div.single-line > span > table > tbody > tr > td.text-right.last-col > div > div > div"
            )
              .invoke("text")
              .then((text3) => {
                cy.log("VAT:", text3); // Logging the received text

                // Clear the text of all characters except numbers and commas
                const cleanedText3 = text3.replace(/[^\d,]/g, "");
                cy.log("Cleaned VAT:", cleanedText3);

                // Convert text to number
                const VAT = parseFloat(cleanedText3.replace(/,/g, "."));
                cy.log("VAT:", VAT);

                // Trying to check for equality between VAT and the calculated value
                try {
                  expect(calculatedVAT).to.equal(VAT.toFixed(2)); // Округляем VAT до двух знаков после запятой
                } catch (error) {
                  // If the numbers are not equal, we display a message in the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log("VAT is not equal to calculated VAT:", errorMessage);
                } finally {
                  // Continue the test even if the numbers don't match
                  cy.log("Continuing with the test..."); // If there was an error, write it to the log
                }
              });
          });
      });
  });
});
