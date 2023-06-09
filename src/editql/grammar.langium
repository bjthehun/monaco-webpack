grammar EditQL

entry Query:
    'QUERY' 'CHANGES' 'BY' '\"' userName=ID '\"';

terminal ID: /[0-9a-zA-Z]+/;

hidden terminal WS: /\s+/;