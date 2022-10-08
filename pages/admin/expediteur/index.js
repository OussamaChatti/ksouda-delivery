import { Button, Table, Tag } from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api";
import Navbar from "../../../components/Navbar/Navbar";

const Expediteur = ({ expediteurs }) => {
  const [listExpediteur, setListExpediteur] = useState(expediteurs);
  const [bordereau,setBordereau] = useState([]);
  const [expandedRows,setExpandedRows] = useState([]);



  const expandedRowRender = () => {
    const columns = [
      {
        title: "Nom de client",
        dataIndex: "nomClient",
        key: "nomClient",
      },
      {
        title: "Adresse",
        dataIndex: "adresse",
        key: "adresse",
      },
      {
        title: "Telephone Client",
        dataIndex: "telClient",
        key: "telClient",
      },
      {
        title: "Quantité",
        dataIndex: "quantite",
        key: "quantite",
      },
      {
        title: "Prix",
        dataIndex: "prix_unit",
        key: "prix_unit",
      },
      {
        title: "Action",
        key: "operation",
        render: (item) => {
          console.log("item", item);
  
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button
                style={{ background: "red", color: "white", border: "none" }}
                onClick={async () => {
                  await api.delete("/bordereau/" + item._id);
                  setListBordereau(
                    listBordereau.filter((elem) => elem._id != item._id)
                  );
                }}
              >
                Annuler
              </button>
              <button
                style={{
                  background: "black",
                  color: "white",
                  border: "none",
                  marginLeft: 20,
                }}
                onClick={() => {
                  setExtrait({
                    ...extrait,
                    nomClient: item.nomClient,
                    codebar: item.codebar,
                  });
                  router.push("/extrait");
                }}
              >
                Imprimer
              </button>
            </div>
          );
        },
      },
    ];
    const data = [];

    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i.toString(),
        date: "2014-12-24 23:12:00",
        name: "This is production name",
        upgradeNum: "Upgraded: 56",
      });
    }


    return (
      <Table columns={columns} dataSource={bordereau} pagination={false} />
    );
  };
  
  const columns = [
    {
      title: "Nom Expediteur",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      key: "state",
      render: (row) => {
        return (row.approved?
          <Tag color="green">Approved</Tag>
          :
          <Tag color="yellow">Waiting Approval</Tag>

        );}
    },
    {
      title: "Action",
      render: (row) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {!row.approved && 
            <Button
              type="primary"
              onClick={async (e) => {
                e.preventDefault();
                await approveUser(row._id);

              }}
            >
              Approver
            </Button>}
            {row.approved && 
            <Button danger
            onClick={async(e) =>{
              e.preventDefault();
              await blockUser(row._id);
            }}
            >
              Bloquer
            </Button>}
          </div>
        );
      },
    },
  ];
  
  const fetchBordereau = async (id) => {
    const res = await fetch(`http://localhost:3000/api/bordereau/expediteur/${id}`);
    console.log(res);
    const list = await res.json();

    setBordereau(list);
  };

  const approveUser = async (id) => {
    toast.promise(api.get("/users/approve/" + id), {
      success: "Expediteur approuver",
      error: "Expediteur déja approuver",
      loading: "Lancement de transaction ...",
    });

    setTimeout(async()=>{
      const res = await fetch("http://localhost:3000/api/users");
      console.log(res);
      const list = await res.json();
      setListExpediteur(list.map((elem) => {
        return { ...elem, key: elem._id };
      }));
    }, 500);
    
  };

  const blockUser = async (id) => {
    await toast.promise(api.get("/users/reject/" + id), {
      success: "Expediteur bloquee",
      error: "Expediteur déja non approvee",
      loading: "Lancement de transaction ...",
    });

   
    setTimeout(async()=>{
      const res = await fetch("http://localhost:3000/api/users");
      console.log(res);
      const list = await res.json();
      setListExpediteur(list.map((elem) => {
        return { ...elem, key: elem._id };
      }));
    }, 500);

  };

  const handleRowExpand = (record) => {
    // if a row is expanded, collapses it, otherwise expands it
    if(expandedRows.includes(record.key)) {
            const row = expandedRows.filter(key => key !== record.key);
            setExpandedRows(row);
          }
        else { setExpandedRows([record.key]) }
    
  }

  return (
    <Navbar>
      <Table
        columns={columns}
        dataSource={listExpediteur}
        size="large"
        bordered
        loading={expediteurs === undefined}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        onExpand={(expande,record)=>{
           fetchBordereau(record._id);
           handleRowExpand(record);
        }}

        // tell the 'Table' component which rows are expanded
        expandedRowKeys={expandedRows}

      />
    </Navbar>
  );
};

export const getServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/users");
  const list = await res.json();

  return {
    props: {
      expediteurs: list.map((elem) => {
        return { ...elem, key: elem._id };
      }),

    },
  };

};
export default Expediteur;
