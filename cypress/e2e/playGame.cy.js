describe("when playing the game", () => {
  it("create a player with limitation", () => {
    cy.visit("http://localhost:3000/");
    cy.findByText("플레이어 생성하기").click();
    cy.url().should("eq", "http://localhost:3000/create-player");
    cy.findByText("방 만들기").click();
    cy.on("window:alert", alert => {
      expect(alert).to.contains("이름을 작성해주세요.");
    });
    cy.findByTestId("nickname-input").type("joshuaaa");
    cy.get("input").should("not.have.value", "joshuaaa");
    cy.get("input").should("have.value", "joshu");
  });

  it("create a room", () => {
    cy.findByText("방 만들기").click();
    cy.findByText("방 생성").click();
    cy.on("window:alert", alert => {
      expect(alert).to.contains("방제목을 입력해주세요.");
    });
    cy.findByTestId("roomtitle-input").type("room1");
    cy.findByText("방 생성").click();
  });

  it("show properly create room page", () => {
    cy.findByText(/waiting for other players/i).should("exist");
    cy.contains("경찰 1").should("exist");
    cy.contains("도둑 1").should("not.exist");
  });
});
