import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import RoleFrom from './RoleForm';
import {addRole} from '../../store/action/roleAction';
import MasterLayout from '../MasterLayout';
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import HeaderTitle from '../header/HeaderTitle';
import {fetchPermissions} from '../../store/action/permissionAction';
import {getFormattedMessage} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const CreateRole = (props) => {
    const {addRole, fetchPermissions, permissions, fetchAllWarehouses, warehouses} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchPermissions();
        fetchAllWarehouses()
    }, []);

    const array = warehouses;
        const newFirstElement = {
            attributes: { name: getFormattedMessage("report-all.warehouse.label") },
            id: null,
        };
    const newArray = warehouses.map((warehouse) => ({label: warehouse.attributes.name, value: warehouse.id}));

    const addRolesData = (formValue) => {
        addRole(formValue, navigate);
    };

    const prepareFormOption = {
        addRolesData,
        permissionsArray: permissions
    };

    return (
        <>
            <MasterLayout>
                <TopProgressBar/>
                <HeaderTitle title={getFormattedMessage("role.create.title")} to='/app/roles'/>
                {permissions.length !== 0 && <RoleFrom {...prepareFormOption} newArray={newArray}/>}
            </MasterLayout>
        </>
    );
}

const preparePermissions = permissions => {
    let permissionArray = [];
    permissions.forEach(permission => {
        permissionArray.push({id: permission.id, name: permission.attributes.display_name})
    });
    return permissionArray;
};

const mapStateToProps = (state) => {
    const {permissions, warehouses} = state;
    return {permissions: preparePermissions(permissions), warehouses}
};

export default connect(mapStateToProps, {addRole, fetchPermissions, fetchAllWarehouses})(CreateRole);
