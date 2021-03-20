import {
  DownOutlined,
  RedEnvelopeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Pagination,
  Row,
  Skeleton,
  Typography,
} from "antd";
import { useComments } from "api/useComments";
import IconText from "components/IconText/IconText";
import useDebounce from "hooks/useDebounce";
import React, { useCallback, useState } from "react";
import { useStore } from "store/store";
import { matchPhoto, matchUser } from "utils/collectionMatches";
import "./ResumeList.css";

const skeletonData = [...Array(10).keys()].map((item) => ({
  body: "",
  email: "",
  id: item,
  name: "",
  postId: item,
}));

const { Text, Title } = Typography;

const ResumeList = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [dropDownValue, setDropDownValue] = useState<"Followed" | "My">(
    "Followed"
  );
  const debouncedFilter = useDebounce(filter, 300);
  const { data, isLoading } = useComments({
    from: page,
    limit: 10,
    name: debouncedFilter,
    postId: dropDownValue === "My" ? 1 : undefined,
  });

  const { users, photos } = useStore(useCallback((state) => state, []));

  return (
    <>
      <Row justify="space-between">
        <Col>
          <Title level={4}>Resume your work</Title>
        </Col>
        <Col>
          <div className="headingWrapper">
            <Input
              size="small"
              placeholder="Filter by title"
              suffix={<SearchOutlined />}
              onChange={(e) => {
                setFilter(e.target.value || "");
              }}
            />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    onClick={() => setDropDownValue("Followed")}
                  >
                    Followed
                  </Menu.Item>
                  <Menu.Item key="2" onClick={() => setDropDownValue("My")}>
                    My
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
              className="dropDown"
            >
              <span onClick={(e) => e.preventDefault()}>
                <span style={{ marginRight: 4 }}>{dropDownValue}</span>
                <DownOutlined />
              </span>
            </Dropdown>
          </div>
        </Col>
      </Row>
      <List
        grid={{ gutter: 16, xl: 1, lg: 1, md: 1, sm: 1, xs: 1, xxl: 1 }}
        dataSource={data || skeletonData}
        renderItem={(item) => (
          <Skeleton loading={isLoading} paragraph={{ rows: 2 }}>
            <List.Item>
              <Card>
                <Title level={5} style={{ color: "#3399ff" }}>
                  {item.name}
                </Title>
                <div>{item.body}</div>
                <div>
                  <IconText
                    icon={
                      <Avatar
                        size="small"
                        src={matchPhoto(photos, item.postId)?.thumbnailUrl}
                      />
                    }
                    text={matchUser(users, item.postId)?.name || ""}
                  />
                  <IconText icon={<RedEnvelopeOutlined />} text="Corporate" />
                  <Text type="secondary">
                    <IconText
                      text={`updated 3 days ago by ${
                        matchUser(users, item.postId)?.name
                      }`}
                    />
                  </Text>
                </div>
              </Card>
            </List.Item>
          </Skeleton>
        )}
      />
      <Row justify="center">
        <Col>
          <Pagination
            defaultCurrent={page}
            total={300}
            showSizeChanger={false}
            onChange={(page) => {
              setPage(page);
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default ResumeList;
