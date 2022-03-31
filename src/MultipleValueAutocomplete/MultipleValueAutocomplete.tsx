import Grow from "@material-ui/core/Grow";
import Menu from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper, { PopperPlacementType } from "@material-ui/core/Popper";
import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField";
import { UseComboboxGetItemPropsOptions } from "downshift";
import React from "react";

import { SyntheticChangeEvent } from "../../types/utils";
import { Choice } from "../Filter";
import { IconButton } from "../IconButton";
import { PlusIcon } from "../icons";
import { Pill } from "../Pill";
import useStyles from "./styles";
import useMultipleValueAutocomplete from "./useMultipleValueAutocomplete";

export interface MultipleValueAutocompleteProps
  extends Omit<StandardTextFieldProps, "onChange"> {
  children: (data: {
    getItemProps: (opts: UseComboboxGetItemPropsOptions<Choice>) => any;
    highlightedIndex: number;
    inputValue: string;
    choices: Choice[];
  }) => React.ReactNode | React.ReactNodeArray;
  className?: string;
  styles?: React.CSSProperties;
  choices: Choice[];
  label?: string;
  popperPlacement?: PopperPlacementType;
  initialValue?: Choice[];
  onChange?: (event: SyntheticChangeEvent<string[]>) => void;
  onInputChange?: (value: string) => void;
}

export const MultipleValueAutocomplete: React.FC<MultipleValueAutocompleteProps> =
  ({
    choices,
    children,
    name,
    InputProps,
    initialValue = [],
    popperPlacement = "bottom-start",
    onChange,
    onInputChange,
    ...rest
  }) => {
    const classes = useStyles();
    const {
      anchor,
      comboboxProps,
      filteredChoices,
      getItemProps,
      getSelectedItemProps,
      getToggleButtonProps,
      highlightedIndex,
      inputProps,
      inputRef,
      inputValue,
      isOpen,
      labelProps,
      menuProps,
      ref,
      removeSelectedItem,
      selectedItems,
    } = useMultipleValueAutocomplete({
      choices,
      initialValue,
      name,
      onChange,
      onInputChange,
    });

    return (
      <>
        <TextField
          {...rest}
          {...comboboxProps}
          name={name}
          InputLabelProps={labelProps}
          ref={ref}
          InputProps={{
            ...InputProps,
            ...inputProps,
            classes: {
              root: classes.inputContainer,
              input: classes.input,
            },
            startAdornment: selectedItems.map((item, index) => (
              <Pill
                key={`selected-item-${index}`}
                {...getSelectedItemProps({ selectedItem: item, index })}
                label={item.label}
                onClick={() => removeSelectedItem(item)}
              />
            )),
            endAdornment: (
              <IconButton
                {...getToggleButtonProps()}
                aria-label="toggle menu"
                className={classes.icon}
                hoverOutline={false}
                type="button"
                variant="secondary"
              >
                <PlusIcon />
              </IconButton>
            ),
          }}
          inputProps={{ ref: inputRef }}
        />
        <div {...menuProps}>
          <Popper
            className={classes.popper}
            open={isOpen}
            anchorEl={anchor.current}
            transition
            placement={popperPlacement}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "left top" : "left bottom",
                }}
              >
                <Paper
                  elevation={8}
                  style={{ width: anchor.current?.clientWidth }}
                >
                  <Menu disablePadding>
                    {children({
                      choices: filteredChoices,
                      highlightedIndex,
                      getItemProps,
                      inputValue,
                    })}
                  </Menu>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </>
    );
  };
