    content: headline|paragraph\n*

    headline: #text\n

    paragraph: textcode\s*

    textcode: text|code

    text: [^<>#\n]

    code: <line line? fen? moves?>

    moves: move moves?
    move: turn san
    turn: \d.(..)?

    <line fen>

    <line 1. san san 2. san>
    <line 2... san>
    <line 3. san>

    <line2 line 3... san>
    <line2 4. san>
    
