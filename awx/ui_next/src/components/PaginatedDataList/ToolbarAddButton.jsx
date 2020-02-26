import React from 'react';
import { string, func } from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from '@patternfly/react-core';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { AddCircleOIcon } from '@patternfly/react-icons';

function ToolbarAddButton({ linkTo, onClick, i18n }) {
  if (!linkTo && !onClick) {
    throw new Error(
      'ToolbarAddButton requires either `linkTo` or `onClick` prop'
    );
  }
  if (linkTo) {
    return (
      <Tooltip content={i18n._(t`Add`)} position="top">
        <Button
          component={Link}
          to={linkTo}
          variant="plain"
          aria-label={i18n._(t`Add`)}
        >
          <AddCircleOIcon />
        </Button>
      </Tooltip>
    );
  }
  return (
    <Button
      onClick={onClick}
      variant="plain"
      aria-label={i18n._(t`Add`)}
    >
      <AddCircleOIcon />
    </Button>

  );
}
ToolbarAddButton.propTypes = {
  linkTo: string,
  onClick: func,
};
ToolbarAddButton.defaultProps = {
  linkTo: null,
  onClick: null,
};

export default withI18n()(ToolbarAddButton);
