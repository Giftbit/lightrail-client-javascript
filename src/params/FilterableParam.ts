export interface FilterTypes {
    lt: string | number;     // Less than (<)
    lte: string | number;    // Less than or equal to (<=)
    gt: string | number;     // Greater than (>)
    gte: string | number;    // Greater than or equal to (>=)
    eq: string | number;     // Equal to (==). This is the default where no operator is specified
    ne: string | number;     // Not equal to (!=)
    in: string | number;     // Equals one of the members of a comma-separated list. Literal commas must be escaped (\,)
    like: string;   // Equal to with wildcard support. Percent signs (%) in the value are wild. This operator is only supported on string properties
}

export type FilterableString = string | Partial<FilterTypes>;
export type FilterableNumber = number | Partial<FilterTypes>;