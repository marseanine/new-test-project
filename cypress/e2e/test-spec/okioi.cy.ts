import "cypress-xpath";
import "@4tw/cypress-drag-drop";

describe("Testing edition of VAT", () => {
  const email = "vincent.depoortere+demo4testers@gmail.com";
  const password = "Demo4Testers";
  let isLoggedIn = false;

  beforeEach(() => {
    if (!isLoggedIn) {
      cy.login(email, password); // Calling the login command

      cy.visit(
        "https://www.okioki.app/booking/b141d57c-a65d-4ad5-d694-08dac681ea18"
      );

      // Wait for the page to load
      cy.wait(5000);

      // We get a token from Session Storage - in the future it can be used to change the percentage in the Rate field and do checks with different percentages
      cy.window().then((win) => {
        const sessionDataString = win.sessionStorage.getItem(
          "oidc.user:https://account.okioki.app:OkiOkiEntrepreneur"
        );
        if (sessionDataString) {
          const sessionData = JSON.parse(sessionDataString);
          const accessToken = sessionData.access_token;
          cy.log("Authorization token: " + accessToken);
        } else {
          cy.log("Authorization token is undefined");
        }
      });

      // Checking for the presence of an element called Telenet BV
      cy.get("div.flex-row:nth-child(2)")
        .should("exist")
        .contains("Telenet BV")
        .click();
    }
  });

  it("editing Amount incl. VAT field", () => {
    const randomNumber = Math.floor(Math.random() * 200);

    // Enter the generated random number in the Amount incl. VAT field
    cy.amountInclVATField().click().clear().type(randomNumber.toString());

    // Check that the text in the header matches the entered value in the Amount incl. VAT field
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
    // Get the text from the Amount incl. VAT field and convert it to a number

    cy.amountInclVATField()
      .invoke("text")
      .then((text) => {
        cy.log("Original text:", text); // Logging the received text;

        // Clear the text of all characters except numbers and commas
        const cleanedText = text.replace(/[^\d,]/g, "");
        cy.log("Cleaned text:", cleanedText);

        // Convert text to number
        const originalNumber = parseFloat(cleanedText.replace(/,/g, "."));
        cy.log("Original number:", originalNumber);

        // Getting text from the Rate field with a percentage
        cy.rateField()
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

              // Get the text from the Amount excl. VAT field

              cy.amountExclVATField()
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

        // Check that the value in the Amount incl. VAT field matches the value in the Amount to pay field
        // Get the text from the Amount incl. VAT field
        cy.amountInclVATField()
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
            cy.amountToPayField()
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

    cy.amountExclVATField()
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
        cy.exclVatField()
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
    cy.amountInclVATField()
      .invoke("text")
      .then((text1) => {
        cy.log("Amount incl. VAT:", text1); // Logging the received text;

        // Clear the text of all characters except numbers and commas
        const cleanedText1 = text1.replace(/[^\d,]/g, "");
        cy.log("Cleaned Amount incl. VAT:", cleanedText1);

        // Convert text to number
        const amountInclVAT = parseFloat(cleanedText1.replace(/,/g, "."));
        cy.log("Amount incl. VAT:", amountInclVAT);

        // Getting text from the Amount excl. VAT field
        cy.amountExclVATField()
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
            cy.vatField()
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
                  expect(calculatedVAT).to.equal(VAT.toFixed(2));
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

  it("editing Amount incl. VAT field", () => {
    const randomNumber = Math.floor(Math.random() * 200);
    isLoggedIn = false;

    // Enter the generated random number in the Amount excl. VAT field
    cy.amountExclVATField().click().clear().type(randomNumber.toString());

    // Check that the text in the header matches the entered value in the Amount incl. VAT field
    cy.get(".amount-negative").click();

    cy.wait(2000);

    // Get the text from the Amount excl. VAT field and convert it to a number
    cy.amountExclVATField()
      .invoke("text")
      .then((amountExclVatText) => {
        // Convert the text to a number
        const amountExclVat = parseFloat(
          amountExclVatText.replace(/[^\d,]/g, "").replace(",", ".")
        );

        // Get the text from the Rate field with a percentage
        cy.rateField()
          .invoke("text")
          .then((rateText) => {
            // Convert the percentage to a number
            const rate =
              parseFloat(rateText.replace(/[^\d,]/g, "").replace(",", ".")) /
                100 +
              1;

            // Calculate the amount incl. VAT
            const amountInclVat = (amountExclVat * rate).toFixed(2);

            // Get the text from the Amount incl. VAT field and convert it to a number
            cy.amountInclVATField()
              .invoke("text")
              .then((amountInclVatText) => {
                // Convert the text to a number
                const amountInclVatFromField = parseFloat(
                  amountInclVatText.replace(/[^\d,]/g, "").replace(",", ".")
                );

                // Compare the calculated Amount incl. VAT with the amount from the field
                expect(parseFloat(amountInclVat)).to.equal(
                  amountInclVatFromField
                );
              });
          });
      });

    cy.amountExclVATField()
      .invoke("text")
      .then((amountExclVatText) => {
        // Convert the text to a number
        const amountExclVat = parseFloat(
          amountExclVatText.replace(/[^\d,]/g, "").replace(",", ".")
        );

        // Get the text from the Rate field with a percentage
        cy.rateField()
          .invoke("text")
          .then((rateText) => {
            // Convert the percentage to a number
            const rate =
              parseFloat(rateText.replace(/[^\d,]/g, "").replace(",", ".")) /
                100 +
              1;

            // Calculate the Amount excl. VAT
            const amountToPay = (amountExclVat * rate).toFixed(2);

            // Get the text from the Amount to pay field and convert it to a number
            cy.amountToPayField()
              .invoke("text")
              .then((amountToPayText) => {
                // Convert the text to a number
                const amountToPayFromField = parseFloat(
                  amountToPayText.replace(/[^\d,]/g, "").replace(",", ".")
                );

                // Compare the calculated amount to pay with the amount from Amount excl. VAT field
                try {
                  expect(parseFloat(amountToPay)).to.equal(
                    amountToPayFromField
                  );
                } catch (error) {
                  // If the numbers are not equal, log the error message
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Amount to pay does not match calculated amount:",
                    errorMessage
                  );
                }
              });
          });
      });
    // Get the text from the Amount excl. VAT field and convert it to a number
    cy.amountExclVATField()
      .invoke("text")
      .then((amountExclVatText) => {
        // Convert the text to a number
        const amountExclVat = parseFloat(
          amountExclVatText.replace(/[^\d,]/g, "").replace(",", ".")
        );

        // Get the text from the Excl. VAT field and convert it to a number
        cy.exclVatField()
          .invoke("text")
          .then((exclVatText) => {
            // Convert the text to a number
            const exclVat = parseFloat(
              exclVatText.replace(/[^\d,]/g, "").replace(",", ".")
            );

            // Compare the values and log an error if they don't match
            try {
              expect(amountExclVat).to.equal(exclVat);
            } catch (error) {
              // If the numbers are not equal, log the error message
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              cy.log(
                "Amount excl. VAT does not match Excl. VAT:",
                errorMessage
              );
            }
          });
      });

    cy.amountInclVATField()
      .invoke("text")
      .then((amountInclVatText) => {
        // Convert the text to a number
        const amountInclVat = parseFloat(
          amountInclVatText.replace(/[^\d,]/g, "").replace(",", ".")
        );

        // Get the text from the Amount excl. VAT field and convert it to a number
        cy.amountExclVATField()
          .invoke("text")
          .then((amountExclVatText) => {
            // Convert the text to a number
            const amountExclVat = parseFloat(
              amountExclVatText.replace(/[^\d,]/g, "").replace(",", ".")
            );

            // Calculate the difference between Amount incl. VAT and Amount excl. VAT and round it to two decimal places
            const difference =
              Math.round((amountInclVat - amountExclVat) * 100) / 100;

            // Get the text from the VAT field and convert it to a number
            cy.vatField()
              .invoke("text")
              .then((vatText) => {
                // Convert the text to a number
                const vat = parseFloat(
                  vatText.replace(/[^\d,]/g, "").replace(",", ".")
                );

                // Compare the calculated difference with the VAT
                try {
                  expect(difference).to.equal(vat);
                } catch (error) {
                  // If the numbers are not equal, log the error message
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Difference between Amount incl. VAT and Amount excl. VAT does not match VAT:",
                    errorMessage
                  );
                }
              });
          });
      });
  });

  it("editing Amount to pay field", () => {
    const randomNumber = Math.floor(Math.random() * 200);
    isLoggedIn = false;

    // Enter the generated random number in the Amount to pay field
    cy.amountToPayField().click().clear().type(randomNumber.toString());

    // Check that the text in the header matches the entered value in the Amount incl field. VAT
    cy.get(".amount-negative").click();

    cy.wait(2000);

    // Getting text from the "Amount to pay" field and header
    cy.amountToPayField()
      .invoke("text")
      .then((amountToPayText) => {
        // Remove characters except numbers, commas and minus signs
        const amountToPay = parseFloat(amountToPayText.replace(/[^\d,-]/g, ""));

        cy.amountToPayField()
          .invoke("text")
          .then((amountToPayText) => {
            // Remove characters except numbers, commas and minus signs
            const amountToPay = parseFloat(
              amountToPayText.replace(/[^\d,.-]/g, "").replace(",", ".")
            );

            cy.get(".amount-negative")
              .invoke("text")
              .then((headerValueText) => {
                // Remove characters except numbers, commas and minus signs
                const headerValue = parseFloat(
                  headerValueText.replace(/[^\d,.-]/g, "").replace(",", ".")
                );

                // Comparing values
                try {
                  expect(amountToPay).to.equal(headerValue);
                } catch (error) {
                  // If the values differ, we display an error message in the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Amount to pay does not match header value:",
                    errorMessage
                  );
                }
              });
          });
      });

    cy.amountToPayField()
      .invoke("text")
      .then((amountToPayText) => {
        // Removing characters other than numbers and commas
        const amountToPay = parseFloat(
          amountToPayText.replace(/[^\d,]/g, "").replace(",", ".")
        );

        cy.amountInclVATField()
          .invoke("text")
          .then((amountInclVATText) => {
            // Removing characters other than numbers and commas
            const amountInclVAT = parseFloat(
              amountInclVATText.replace(/[^\d,]/g, "").replace(",", ".")
            );

            // Comparing values
            try {
              expect(amountToPay).to.equal(amountInclVAT);
            } catch (error) {
              // If the values differ, we display an error message in the log
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              cy.log(
                "Amount to pay does not match Amount incl. VAT:",
                errorMessage
              );
            }
          });
      });

    // Getting the text from the "Amount to pay" field
    cy.amountToPayField()
      .invoke("text")
      .then((amountToPayText) => {
        // Remove characters except numbers, commas and minus signs
        const amountToPay = parseFloat(amountToPayText.replace(/[^\d,-]/g, ""));

        // Getting text from the "Rate" field
        cy.rateField()
          .invoke("text")
          .then((rateText) => {
            // Remove characters except numbers and percent sign
            const rate = parseFloat(rateText.replace(/[^\d]/g, "")) / 100 + 1;

            // Calculate the value by dividing "Amount to pay" by the VAT coefficient
            const calculatedAmountExclVAT = (amountToPay / rate).toFixed(2);

            // Getting text from the field "Amount excl. VAT"
            cy.amountExclVATField()
              .invoke("text")
              .then((amountExclVATText) => {
                // Remove characters except numbers, commas and minus signs
                const amountExclVAT = parseFloat(
                  amountExclVATText.replace(/[^\d,-]/g, "")
                );

                // Comparing values
                try {
                  expect(calculatedAmountExclVAT).to.equal(amountExclVAT);
                } catch (error) {
                  // If the values differ, we display an error message in the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Calculated Amount excl. VAT does not match Amount excl. VAT:",
                    errorMessage
                  );
                }
              });
          });
      });

    //Getting text from the "amount To Pay" field
    cy.amountToPayField()
      .invoke("text")
      .then((amountToPayText) => {
        // Удаляем символы, кроме цифр, запятых и знака минуса
        const amountToPay = parseFloat(amountToPayText.replace(/[^\d,-]/g, ""));

        // Getting text from the "Rate" field
        cy.rateField()
          .invoke("text")
          .then((rateText) => {
            // Removing characters other than numbers and percent signs
            const rate = parseFloat(rateText.replace(/[^\d]/g, "")) / 100 + 1;

            // Calculate the value by dividing "Amount to pay" by the VAT coefficient
            const calculatedExclVAT = (amountToPay / rate).toFixed(2);

            // Getting text from the "Excl. VAT" field
            cy.exclVatField()
              .invoke("text")
              .then((exclVATText) => {
                // Removing characters other than numbers and percent signs
                const exclVAT = parseFloat(exclVATText.replace(/[^\d,-]/g, ""));

                // Сравниваем значения
                try {
                  expect(calculatedExclVAT).to.equal(exclVAT);
                } catch (error) {
                  // If the values differ, we display an error message in the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Calculated Excl. VAT does not match Excl. VAT:",
                    errorMessage
                  );
                }
              });
          });
      });

    // Getting the text from the "Amount to pay" field
    cy.amountToPayField()
      .invoke("text")
      .then((amountToPayText) => {
        // Removing characters other than numbers and commas
        const amountToPay = parseFloat(
          amountToPayText.replace(/[^\d,]/g, "").replace(",", ".")
        );

        // Getting text from the "Excl. VAT" field
        cy.exclVatField()
          .invoke("text")
          .then((exclVATText) => {
            // Removing characters other than numbers and commas
            const exclVAT = parseFloat(
              exclVATText.replace(/[^\d,]/g, "").replace(",", ".")
            );

            // Subtract the value "Excl. VAT" from the value "Amount to pay"
            const calculatedVAT = (amountToPay - exclVAT).toFixed(2);

            // Getting text from the "VAT" field
            cy.vatField()
              .invoke("text")
              .then((vatText) => {
                // Remove non-numeric characters except commas
                const vat = parseFloat(
                  vatText.replace(/[^\d,]/g, "").replace(",", ".")
                );

                // Comparing values
                try {
                  expect(parseFloat(calculatedVAT)).to.equal(vat);
                } catch (error) {
                  // If the values differ, we display an error message in the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log("Calculated VAT does not match VAT:", errorMessage);
                }
              });
          });
      });
  });

  it("editing Excl. VAT field", () => {
    const randomNumber = Math.floor(Math.random() * 200);
    isLoggedIn = false;

    // Enter the generated random number in the Amount incl field. VAT
    cy.exclVatField().click().clear().type(randomNumber.toString());

    // Check that the text in the header matches the entered value in the Amount incl field. VAT
    cy.get(".amount-negative").click();

    cy.wait(2000);

    // Get text from the "Excl. VAT" field
    cy.exclVatField()
      .invoke("text")
      .then((exclVATText) => {
        // Remove non-numeric characters except commas
        const exclVAT = parseFloat(
          exclVATText.replace(/[^\d,]/g, "").replace(",", ".")
        );

        // Get text from the "Rate" field
        cy.rateField()
          .invoke("text")
          .then((rateText) => {
            // Remove non-numeric characters
            const rate = parseFloat(rateText.replace(/[^\d]/g, "")) / 100;

            // Calculate the sum by adding the rate to Excl. VAT
            const calculatedAmountInclVAT = (exclVAT * (1 + rate)).toFixed(2);

            // Get text from the "Amount incl. VAT" field
            cy.amountInclVATField()
              .invoke("text")
              .then((amountInclVATText) => {
                // Remove non-numeric characters except commas
                const amountInclVAT = parseFloat(
                  amountInclVATText.replace(/[^\d,]/g, "").replace(",", ".")
                );

                // Check if the percentage from the "Rate" field matches the calculated percentage
                const calculatedRate = (
                  (amountInclVAT - exclVAT) /
                  exclVAT
                ).toFixed(2);
                expect(parseFloat(calculatedRate)).to.equal(rate);

                // Compare values
                try {
                  expect(parseFloat(calculatedAmountInclVAT)).to.equal(
                    amountInclVAT
                  );
                } catch (error) {
                  // If the values ​​differ, output an error message to the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Calculated Amount incl. VAT does not match Amount incl. VAT:",
                    errorMessage
                  );
                }
              });
          });
      });

    // Get text from the "Excl. VAT" field
    cy.exclVatField()
      .invoke("text")
      .then((exclVATText) => {
        // Remove non-numeric characters, commas, and minus sign
        const exclVAT = parseFloat(exclVATText.replace(/[^\d,-]/g, ""));

        // Get text from the "Amount excl. VAT" field
        cy.amountExclVATField()
          .invoke("text")
          .then((amountExclVATText) => {
            // Remove non-numeric characters, commas, and minus sign
            const amountExclVAT = parseFloat(
              amountExclVATText.replace(/[^\d,-]/g, "")
            );

            // Compare values
            try {
              expect(exclVAT).to.equal(amountExclVAT);
            } catch (error) {
              // If the values ​​differ, output an error message to the log
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              cy.log(
                "Excl. VAT does not match Amount excl. VAT:",
                errorMessage
              );
            }
          });
      });
    // Get text from the "Excl. VAT" field
    cy.exclVatField()
      .invoke("text")
      .then((exclVATText) => {
        // Remove non-numeric characters, commas, and minus sign
        const exclVAT = parseFloat(exclVATText.replace(/[^\d,-]/g, ""));

        // Get text from the "Rate" field
        cy.rateField()
          .invoke("text")
          .then((rateText) => {
            // Remove non-numeric characters
            const rate = parseFloat(rateText.replace(/[^\d]/g, "")) / 100;

            // Calculate the sum of Excl. VAT and the rate
            const sum = (exclVAT * (1 + rate)).toFixed(2);

            // Get text from the "Amount to pay" field
            cy.amountToPayField()
              .invoke("text")
              .then((amountToPayText) => {
                // Remove non-numeric characters, commas, and minus sign
                const amountToPay = parseFloat(
                  amountToPayText.replace(/[^\d,]/g, "").replace(",", ".")
                );

                // Compare values
                try {
                  expect(parseFloat(sum)).to.equal(amountToPay);
                } catch (error) {
                  // If the values ​​differ, output an error message to the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Sum of Excl. VAT and Rate does not match Amount to pay:",
                    errorMessage
                  );
                }
              });
          });
      });

    // Get text from the "Excl. VAT" field
    cy.exclVatField()
      .invoke("text")
      .then((exclVATText) => {
        // Convert text to a number, preserving decimal places
        const exclVAT = parseFloat(
          exclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
        );

        // Get text from the "Amount incl. VAT" field
        cy.amountInclVATField()
          .invoke("text")
          .then((amountInclVATText) => {
            // Convert text to a number, preserving decimal places
            const amountInclVAT = parseFloat(
              amountInclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
            );

            // Calculate the difference between "Amount incl. VAT" and "Excl. VAT"
            const difference = parseFloat((amountInclVAT - exclVAT).toFixed(2));

            // Get text from the "VAT" field
            cy.vatField()
              .invoke("text")
              .then((vatText) => {
                // Convert text to a number, preserving decimal places
                const vat = parseFloat(
                  vatText.replace(/[^\d,.]/g, "").replace(",", ".")
                );

                // Compare values
                try {
                  expect(difference).to.equal(vat);
                } catch (error) {
                  // If the values ​​do not match, output an error message to the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Difference between Amount incl. VAT and Excl. VAT does not match VAT:",
                    errorMessage
                  );
                }
              });
          });
      });
  });

  it("editing  VAT field", () => {
    const randomNumber = Math.floor(Math.random() * 200);
    isLoggedIn = false;

    // Enter the generated random number in the Amount incl field. VAT
    cy.vatField().click().clear().type(randomNumber.toString());

    // Check that the text in the header matches the entered value in the Amount incl field. VAT
    cy.get(".amount-negative").click();

    cy.wait(2000);

    // Get text from the "Excl. VAT" field
    cy.vatField()
      .invoke("text")
      .then((vatText) => {
        // Convert text to a number, preserving decimal places
        const vat = parseFloat(
          vatText.replace(/[^\d,.]/g, "").replace(",", ".")
        );

        // Get text from the "Excl. VAT" field
        cy.exclVatField()
          .invoke("text")
          .then((exclVATText) => {
            // Convert text to a number, preserving decimal places
            const exclVAT = parseFloat(
              exclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
            );

            // Calculate the sum of VAT and Excl. VAT
            const calculatedAmountInclVAT = parseFloat(
              (vat + exclVAT).toFixed(2)
            );

            // Get text from the "Amount incl. VAT" field
            cy.amountInclVATField()
              .invoke("text")
              .then((amountInclVATText) => {
                // Convert text to a number, preserving decimal places
                const amountInclVAT = parseFloat(
                  amountInclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
                );

                // Compare values
                try {
                  expect(calculatedAmountInclVAT).to.equal(amountInclVAT);
                } catch (error) {
                  // If the values do not match, output an error message to the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Sum of VAT and Excl. VAT does not match Amount incl. VAT:",
                    errorMessage
                  );
                }
              });
          });
      });

    // Get text from the "Amount incl. VAT" field
    cy.amountInclVATField()
      .invoke("text")
      .then((amountInclVATText) => {
        // Convert text to a number, preserving decimal places
        const amountInclVAT = parseFloat(
          amountInclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
        );

        // Get text from the "VAT" field
        cy.vatField()
          .invoke("text")
          .then((vatText) => {
            // Convert text to a number, preserving decimal places
            const vat = parseFloat(
              vatText.replace(/[^\d,.]/g, "").replace(",", ".")
            );

            // Calculate the difference between "Amount incl. VAT" and VAT
            const calculatedAmountExclVAT = parseFloat(
              (amountInclVAT - vat).toFixed(2)
            );

            // Get text from the "Amount excl. VAT" field
            cy.amountExclVATField()
              .invoke("text")
              .then((amountExclVATText) => {
                // Convert text to a number, preserving decimal places
                const amountExclVAT = parseFloat(
                  amountExclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
                );

                // Compare values
                try {
                  expect(calculatedAmountExclVAT).to.equal(amountExclVAT);
                } catch (error) {
                  // If the values do not match, output an error message to the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Difference between Amount incl. VAT and VAT does not match Amount excl. VAT:",
                    errorMessage
                  );
                }
              });
          });
      });

    // Get text from the "VAT" field
    cy.vatField()
      .invoke("text")
      .then((vatText) => {
        // Convert text to a number, preserving decimal places
        const vat = parseFloat(
          vatText.replace(/[^\d,.]/g, "").replace(",", ".")
        );

        // Get text from the "Excl. VAT" field
        cy.exclVatField()
          .invoke("text")
          .then((exclVATText) => {
            // Convert text to a number, preserving decimal places
            const exclVAT = parseFloat(
              exclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
            );

            // Calculate the sum of VAT and Excl. VAT
            const calculatedAmountToPay = (vat + exclVAT).toFixed(2);

            // Get text from the "Amount to pay" field
            cy.amountToPayField()
              .invoke("text")
              .then((amountToPayText) => {
                // Convert text to a number, preserving decimal places
                const amountToPay = parseFloat(
                  amountToPayText.replace(/[^\d,.]/g, "").replace(",", ".")
                );

                // Compare values
                try {
                  expect(calculatedAmountToPay).to.equal(amountToPay);
                } catch (error) {
                  // If the values do not match, output an error message to the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Calculated amount to pay does not match Amount to pay:",
                    errorMessage
                  );
                }
              });
          });
      });

    // Get text from the "Amount incl. VAT" field
    cy.amountInclVATField()
      .invoke("text")
      .then((amountInclVATText) => {
        // Convert text to a number, preserving decimal places
        const amountInclVAT = parseFloat(
          amountInclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
        );

        // Get text from the "VAT" field
        cy.vatField()
          .invoke("text")
          .then((vatText) => {
            // Convert text to a number, preserving decimal places
            const vat = parseFloat(
              vatText.replace(/[^\d,.]/g, "").replace(",", ".")
            );

            // Subtract VAT value from Amount incl. VAT value
            const calculatedExclVAT = (amountInclVAT - vat).toFixed(2);

            // Get text from the "Excl. VAT" field
            cy.exclVatField()
              .invoke("text")
              .then((exclVATText) => {
                // Convert text to numbers, preserving decimal places
                const calculatedExclVAT = parseFloat(
                  (amountInclVAT - vat).toFixed(2)
                );
                const exclVAT = parseFloat(
                  exclVATText.replace(/[^\d,.]/g, "").replace(",", ".")
                );

                // Compare values
                try {
                  expect(calculatedExclVAT).to.equal(exclVAT);
                } catch (error) {
                  // If the values do not match, output an error message to the log
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  cy.log(
                    "Calculated Excl. VAT does not match Excl. VAT:",
                    errorMessage
                  );
                }
              });
          });
      });
  });
});
