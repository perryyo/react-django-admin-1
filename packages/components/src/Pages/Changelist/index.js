import React from "react";
import "../../styles/css/changelists.css";
import { Page, SiteContent } from "../utils";

const SearchForm = () => {
  return (
    <div id="toolbar">
      <form id="changelist-search" method="get">
        <div>
          <label for="searchbar">
            <img src="/styles/img/search.svg" alt="Search" />
          </label>
          <input
            type="text"
            size="40"
            name="q"
            value=""
            id="searchbar"
            autoFocus
          />
          <input type="submit" value="Search" />
        </div>
      </form>
    </div>
  );
};

const ActionForm = () => {
  return (
    <div className="actions">
      <label>
        Action:
        <select name="action" required>
          <option value="" selected="selected">
            ---------
          </option>
          <option value="delete_selected">Delete selected users</option>
        </select>
      </label>
      <input
        className="select-across"
        name="select_across"
        type="hidden"
        value="0"
      />
      <button
        type="submit"
        className="button"
        title="Run the selected action"
        name="index"
        value="0"
      >
        Go
      </button>
      <span
        className="action-counter"
        data-actions-icnt="1"
        style={{ display: "inline" }}
      >
        0 of 1 selected
      </span>
    </div>
  );
};
const ColumnHead = ({
  field,
  text,
  order = false,
  sorted = false,
  sorting_order = "ascending"
}) => {
  return (
    <th
      scope="col"
      className={`${
        order ? `sortable ${sorted ? "sorted " + sorting_order : ""}` : ""
      } column-${field}"`}
    >
      {sorted ? (
        <div className="sortoptions">
          <a className="sortremove" href="?o=" title="Remove from sorting" />
          <a
            href="?o=-1"
            className={`toggle ${sorting_order}`}
            title="Toggle sorting"
          />
        </div>
      ) : null}
      <div className="text">
        {order ? <a href="?o=2.1">{text}</a> : <span>{text}</span>}
      </div>
      <div className="clear" />
    </th>
  );
};
const Row = ({ keys, value, display_link = false, pk, Link }) => {
  return (
    <th className={`field-${keys}`}>
      {display_link ? (
        <Link to={`/auth/user/${pk}/change/`}>{value}</Link>
      ) : typeof value === "boolean" ? (
        <img src={`/styles/img/icon-${value ? "yes" : "no"}.svg`} alt={value} />
      ) : (
        value
      )}
    </th>
  );
};
const ChangeListResult = ({
  heading,
  data,
  toggleIndividualSelect,
  toggleSelectAll,
  selectAll,
  Link,
  selectedValues
}) => {
  const isChecked = item => {
    return selectedValues.indexOf(item.id) > -1;
  };
  return (
    <div className="results">
      <table id="result_list">
        <thead>
          <tr>
            <th scope="col" className="action-checkbox-column">
              <div className="text">
                <span>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    id="action-toggle"
                  />
                </span>
              </div>
              <div className="clear" />
            </th>
            {heading.map((heading, index) => (
              <ColumnHead
                field={heading.field}
                text={heading.text}
                order={!!heading.order}
                sorted={!!heading.sorted}
                sorting_order={heading.sorting_order}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className="row1">
              <td className="action-checkbox">
                <input
                  className="action-select"
                  name="_selected_action"
                  type="checkbox"
                  checked={isChecked(item)}
                  onChange={e => toggleIndividualSelect(e, item.id)}
                  defaultValue={item.id}
                />
              </td>
              {item.data.map((val, ind) => (
                <Row
                  Link={Link}
                  keys={val.key}
                  value={val.value}
                  display_link={!!val.display_link}
                  pk={item.id}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
class ChangeListView extends React.Component {
  state = {
    selectAll: false,
    selectedValues: [],
    heading: [
      {
        field: "username",
        text: "Username",
        order: true,
        sorted: true,
        sorting_order: "ascending"
      },
      { field: "email", text: "Email address", order: true },
      { field: "first_name", text: "First name", order: true },
      { field: "last_name", text: "Last name", order: true },
      { field: "is_staff", text: "Staff status", order: true }
    ],
    data: [
      {
        id: 1,
        data: [
          { key: "username", value: "biola", display_link: true },
          { key: "email", value: "gbozee@example.com" },
          { key: "first_name", value: "" },
          { key: "last_name", value: "" },
          { key: "is_staff", value: true }
        ]
      }
    ]
  };
  toggleSelectAll = () => {
    const values = this.state.data.map(x => x.id);
    this.setState(state => ({
      ...state,
      selectedValues: !state.selectAll ? values : [],
      selectAll: !state.selectAll
    }));
  };
  toggleIndividualSelect = (e, value) => {
    let index = this.state.selectedValues.indexOf(value);
    const target = e.target.checked;
    this.setState(state => {
      let selectedValues = state.selectedValues;
      if (target) {
        if (index == -1) {
          selectedValues.push(value);
        }
      } else {
        if (index > -1) {
          selectedValues.splice(index, 1);
        }
      }
      return { ...state, selectedValues };
    });
  };

  render() {
    return (
      <form id="changelist-form" method="post" noValidate>
        <ActionForm />
        <ChangeListResult
          Link={this.props.Link}
          toggleIndividualSelect={this.toggleIndividualSelect}
          toggleSelectAll={this.toggleSelectAll}
          selectedValues={this.state.selectedValues}
          selectAll={this.state.selectAll}
          heading={this.state.heading}
          data={this.state.data}
        />
        <p class="paginator"> 1 user </p>
      </form>
    );
  }
}

class Changelist extends React.Component {
  state = {
    currentUrl: "/auth/user"
  };
  updateUrl = currentUrl => {
    this.setState(state => ({ ...state, currentUrl }));
  };
  render() {
    const urls = [
      {
        url: "/auth/",
        text: "Authentication And Authorization"
      },
      { url: "user", text: "Users" }
    ];
    const filters = [
      {
        name: "By staff status",
        options: [
          { path: "", name: "All" },
          { path: "is_staff__exact=1", name: "Yes" },
          { path: "is_staff__exact=0", name: "No" }
        ]
      },
      {
        name: "By superuser status",
        options: [
          { path: "", name: "All" },
          { path: "is_superuser__exact=1", name: "Yes" },
          { path: "is_superuser__exact=0", name: "No" }
        ]
      },
      {
        name: "By active",
        options: [
          { path: "", name: "All" },
          { path: "is_active__exact=1", name: "Yes" },
          { path: "is_active__exact=0", name: "No" }
        ]
      }
    ];

    const pathname = urls.map(x => x.url).join("");
    const FilterGroup = this.props.LinkFilterGroup;
    return (
      <Page
        Link={this.props.Link}
        className="app-auth model-user change-list"
        urls={urls}
      >
        <SiteContent addButton headerText="Select user to change">
          <SearchForm />
          <div id="changelist-filter">
            <h2>Filter</h2>
            {filters.map((filt, index) => (
              <FilterGroup
                pathname={pathname}
                currentUrl={this.state.currentUrl}
                updateParentUrl={this.updateUrl}
                key={index}
                heading={filt.name}
                options={filt.options}
              />
            ))}
          </div>
          <ChangeListView Link={this.props.Link} />
        </SiteContent>
      </Page>
    );
  }
}

export default Changelist;
