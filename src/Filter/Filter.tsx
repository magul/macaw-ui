import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import { difference } from "lodash";
import React from "react";

import { DeleteIcon } from "../icons";
import { useFilters } from "./context";
import { FilterContent } from "./FilterContent";
import useStyles from "./styles";
import {
  EventTarget,
  FilterDetailedOptions,
  FilterLabels,
  FilterOptions,
  FilterType,
} from "./types";
import * as utils from "./utils";

export type FilterProps = FilterOptions & FilterDetailedOptions;
export const Filter: React.FC<FilterProps> = ({ name, label, ...options }) => {
  const { register, set, unregister } = useFilters();
  const registered = React.useRef(false);
  React.useEffect(() => {
    register(name, label, options);
    registered.current = true;

    return () => unregister(name);
  }, []);

  React.useEffect(() => {
    if (
      registered.current &&
      options.choices !== undefined &&
      difference(options.choices, options.choices).length
    ) {
      set(name, {
        options: {
          ...options,
          choices: options.choices,
        },
      });
    }
  }, [options.choices]);

  return null;
};

export interface FilterRowProps {
  first: boolean;
  name: string;
  labels: FilterLabels;
}
export const FilterRow: React.FC<FilterRowProps> = ({
  first,
  name,
  labels,
}) => {
  const classes = useStyles();
  const { filters, toggle, toggleRange } = useFilters();

  const filter = filters.find((filter) => filter.name === name);

  if (!filter?.active) {
    return null;
  }

  const availableFilters = utils.getAvailableFilters(filters);
  const options = [filter, ...availableFilters];

  const change = (event: React.ChangeEvent<EventTarget<unknown>>) => {
    toggle(name);
    toggle(event.target.value as string);
  };

  return (
    <div className={classes.filter}>
      <Typography className={classes.filterConjunction}>
        {first ? labels.where : labels.and}
      </Typography>
      <Select
        className={classes.filterName}
        classes={{
          selectMenu: classes.filterInputInner,
        }}
        variant="outlined"
        onChange={change}
        value={filter.name}
      >
        {options.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <Select
        disabled={filter.options.type !== FilterType.Range}
        className={classes.filterRange}
        classes={{
          selectMenu: classes.filterInputInner,
        }}
        variant="outlined"
        value={filter.range.toString()}
        onChange={() => toggleRange(name)}
      >
        <MenuItem value="false">{labels.is}</MenuItem>
        <MenuItem value="true">{labels.range}</MenuItem>
      </Select>
      <FilterContent filter={filter} labels={labels} />
      <IconButton className={classes.filterDelete} onClick={() => toggle(name)}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};
