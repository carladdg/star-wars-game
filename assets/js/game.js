// Character constructor

class character {
    constructor(name, id, healthPoints, attackPower, counterAttackPower) {
        this.name = name;
        this.id = id;
        this.baseHealthPoints = healthPoints;
        this.currentHealthPoints = healthPoints;
        this.baseAttackPower = attackPower;
        this.currentAttackPower = attackPower;
        this.counterAttackPower = counterAttackPower;
    }

    incrementAttackPower() {
        this.currentAttackPower += this.baseAttackPower;
    }

    reset() {
        this.currentHealthPoints = this.baseHealthPoints;
        $(this.id + "-health").text(this.currentHealthPoints);
        this.currentAttackPower = this.baseAttackPower;
        $(this.id).show().detach().appendTo(".characters");
    }
}

// Game properties and methods

var rpgGame = {
    lukeSkywalker: new character("Luke Skywalker", "#luke-skywalker", 100, 20, 5),

    obiWanKenobi: new character("Obi-Wan Kenobi", "#obi-wan-kenobi", 120, 12, 10),

    darthSidious: new character("Darth Sidious", "#darth-sidious", 150, 5, 15),

    darthMaul: new character("Darth Maul", "#darth-maul", 180, 2, 19),

    characterIsSelected: false,

    selectedCharacter: {},

    opponentIsActive: false,

    activeOpponent: {},

    numberOfOpponentsRemaining: 3,

    identifySelection: function(userClick) {
        if (userClick.is(this.lukeSkywalker.id)) {
            return this.lukeSkywalker;
        } else if (userClick.is(this.obiWanKenobi.id)) {
            return this.obiWanKenobi;
        } else if (userClick.is(this.darthSidious.id)) {
            return this.darthSidious;
        } else if (userClick.is(this.darthMaul.id)) {
            return this.darthMaul;
        } else {
            return null;
        }    
    },

    assignSelectedCharacter: function(userSelection) {
        if (!this.characterIsSelected) {
            this.selectedCharacter = userSelection;
            this.characterIsSelected = true;

            $("#character-text").text("You are " + this.selectedCharacter.name + "!");
        }
    }, 

    assignActiveOpponent: function(userSelection) {
        if (!this.opponentIsActive) {
            this.activeOpponent = userSelection;
            this.opponentIsActive = true;
        }
    },

    attackOpponent: function() {
        $("#attack-results").html("You attacked " + this.activeOpponent.name + " for " + this.selectedCharacter.currentAttackPower + " damage. <br>" + this.activeOpponent.name + " attacked you back for " + this.activeOpponent.counterAttackPower + " damage.");
        
        this.activeOpponent.currentHealthPoints -= this.selectedCharacter.currentAttackPower
        $(this.activeOpponent.id + "-health").text(this.activeOpponent.currentHealthPoints);
        this.selectedCharacter.incrementAttackPower();

        this.selectedCharacter.currentHealthPoints -= this.activeOpponent.counterAttackPower;
        $(this.selectedCharacter.id + "-health").text(this.selectedCharacter.currentHealthPoints);

        this.checkHealthPoints();
    },

    checkHealthPoints: function() {
        if (this.activeOpponent.currentHealthPoints <= 0) {
            this.numberOfOpponentsRemaining--;
            this.opponentIsActive = false;

            if (this.numberOfOpponentsRemaining > 0) {
                this.endBattle();
                this.winBattle();
                $("#battleground-text").html("You beat " + this.activeOpponent.name + "! <br><br>" + this.numberOfOpponentsRemaining + " left to beat.");
                $(this.selectedCharacter.id).detach().appendTo(".characters");
                $("#inactive-opponent-text, .character-container").css("opacity", "1");
            } else {
                this.endBattle();
                this.winBattle();
                this.endGame();
                $("#battleground-text").text("You won!");
                $(this.selectedCharacter.id).css("border-color", "var(--green)");
            }
        }
        
        if (this.selectedCharacter.currentHealthPoints <= 0) {
            this.endBattle();
            this.loseBattle();
            this.endGame();
            $("#battleground-text").text("You lost!");
            $(this.activeOpponent.id).css("border-color", "var(--red)");
        }
    },

    endBattle: function() {
        $("#attack-button").hide(); 
        $("#attack-results").html("");
    },

    winBattle: function() {
        $(this.activeOpponent.id).hide();
    },

    loseBattle: function() {
        $(this.selectedCharacter.id).hide();
    },

    endGame: function() {
        $(".game-selection-area").hide();
        $("#restart-button").show();
    },

    restartGame: function() {
        this.lukeSkywalker.reset();
        this.obiWanKenobi.reset();
        this.darthSidious.reset();
        this.darthMaul.reset();
        
        this.characterIsSelected = false;
        this.selectedCharacter = {};
        this.opponentIsActive = false;
        this.activeOpponent = {};
        this.numberOfOpponentsRemaining = 3;

        $(".game-selection-area").show();
        $("#character-text").text("Choose Your Fighter");
        $(".character-container, #inactive-opponent-text").css("opacity", "1");
        $(".character-container").css("border-color", "var(--black)");
        $("#inactive-opponent-text, #battleground-text").text("");
        $(".game-battleground-area").css("width", "");
        $("#restart-button").hide();
    }
}

// Click events

$(".characters").on("click", function(event) {
    var userClick = $(event.target).parent();
    var userSelection = rpgGame.identifySelection(userClick);

    if (userSelection === null) {
        return
    } else {
        rpgGame.assignSelectedCharacter(userSelection);
    }

    $(".character-container").not(rpgGame.selectedCharacter.id).detach().appendTo(".inactive-opponents");
    $("#inactive-opponent-text").text("Choose Your Opponent");
})

$(".inactive-opponents").on("click", function(event) {
    var userClick = $(event.target).parent();
    var userSelection = rpgGame.identifySelection(userClick);

    if (userSelection === null) {
        return
    } else {
        rpgGame.assignActiveOpponent(userSelection);
    }
    
    $(".game-battleground-area").css("width", "100%");
    $("#battleground-text").text("May the Force Be With You!")
    $(rpgGame.selectedCharacter.id).detach().prependTo(".fighters");
    $("#attack-button").show();
    $(rpgGame.activeOpponent.id).detach().appendTo(".fighters");
    
    $("#inactive-opponent-text").css("opacity", "0.5");
    $(".character-container").not(rpgGame.selectedCharacter.id).not(rpgGame.activeOpponent.id).css("opacity", "0.5");
})

$("#attack-button").on("click", function() {
    rpgGame.attackOpponent();
})

$("#restart-button").on("click", function() {
    rpgGame.restartGame();
})