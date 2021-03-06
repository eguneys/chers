    content: headline|paragraph

    headline: # text\n

    paragraph: textcode paragraph

    textcode: text|code

    text: [^<>]

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
    
