# Solitaire

This simple version of Solitaire created as excercise in coding websistes. Solitaire is card game in which player have to arrange the cards on the stack in correct order. This game has a lot of variations, but in this project user can play in version knows as Klondike.

## Rules of game

- In Klondike is used standard 52-card deck;
- There are 7 piles of card, where each pile has one more card than the last. First card of each pile is facing up, and can be moved. This is main part of board;
- In the right-top corner there is a stock of remaining cards, facing down. This cards can be reverse in sequence and use at any time. When all cards from stock were reversed, then they back to the begining;
- In the left-top part of board are four areas (which I'll call as final areas), intended to four stacks of ordered card, each will contain cards in one suit, at the end of game. On an empty areas, you can put only Aces, no matter what suit.
- When you put Ace on final area, you can put next card in deck (that is 2) and so on, till you put a King. Of course all cards must be in same suit;
- First cards from piles can be moved to another piles, or final areas;
- You can place card on avaible cards only if placing card is one number lower and has opposed color than card on which you move;
- On empty piles in main board, you can put only Kings.
- When you move card, and it has layed lower cards, this cards is moving together, too;
- If there is a stack of following cards, you don't have to moved all. For example, if you have stack of cards where are 9,8,7,6,5, you can move only 7,6,5;
- The game is ending in two cases. When you put all cards on four stacks on final areas, you win the game. But if there is no reasonable move, you lose the game.

## Rules of points

**Your aim is getting the lowest score**

- 1 move = 1 point
- reversing card from stock of remaining cards = 2 points
- moving card with 
  - one lower card = 10 points
  - each next card + 10 points
- placing Ace on final area = 50 points
- placing card on final area = 10 points
- placing King card on empty place = 15 points

# Have a lot of fun!
