## Chers

Chers markdown parser. Chers markdown combines chess notation with regular text.

It looks like this:

```
# This is a headline

This is regular text. Below is a fen definition for a line called "initial"
<initial rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1>

Next is chess moves written in algebraic notation. <initial 1. e4 e5 2. Nf3 Nf6> 

You can describe variations from a line like this <line2 initial 2... Nc6 3. a3>

```

## Notes

    content: headline|board|paragraph\n*

    headline: #text\n

    paragraph: textcode\s*

    board: =line ([1-9]\d*)\n

    textcode: text|code

    text: [^<>#\n]

    code: fencode|linecode|linebranch

    fencode: <line fen>
    linecode: <line moves>
    linebranch: <line line moves>

    moves: move*
    move: turn san san |
        turn san
    turn: (\d)*... |
    (\d)*.

    <line fen>

    <line 1. san san 2. san>
    <line 2... san>
    <line 3. san>

    <line2 line 3... san>
    <line2 4. san>
    
