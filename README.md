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
    
