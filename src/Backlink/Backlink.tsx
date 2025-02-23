import Portal from "@material-ui/core/Portal";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

import { ArrowRightIcon } from "../icons";
import { LayoutButton, LayoutButtonProps } from "../LayoutButton";
import { useTheme } from "../theme";
import { useBacklink } from "./context";
import useStyles from "./styles";

export interface AppHeaderProps extends LayoutButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

export const Backlink: React.FC<AppHeaderProps> = ({
  children,
  disabled,
  onClick,
  ...props
}) => {
  const { ssr } = useTheme();
  const classes = useStyles();
  const anchor = useBacklink();

  if (!anchor.current && !ssr) {
    return null;
  }

  return (
    <Portal container={anchor.current}>
      <LayoutButton
        className={classes.root}
        disabled={disabled}
        onClick={onClick}
        data-test-id="app-header-back-button"
        {...props}
      >
        <ArrowRightIcon className={classes.backArrow} />
        {children ? (
          <div className={classes.title}>{children}</div>
        ) : (
          <Skeleton className={classes.skeleton} />
        )}
      </LayoutButton>
    </Portal>
  );
};
Backlink.displayName = "Backlink";
