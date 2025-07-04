import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import theme from '../constants/theme'; // Your theme file

const Table = ({
    columns = [], // Array of { key: string, label: string, width?: number | string, flex?: number }
    data = [],
    totalRows = 0, // For server-side pagination
    onPageChange, // (page, rowsPerPage) => void, for server-side
    loading = false,
    rowsPerPageOptions = [6, 10, 20, 50, Infinity], // Infinity for 'All'
    defaultRowsPerPage = 6,
    paginationType = 'client', // 'client' or 'server'
    initialPage = 1,
    tableStyle = {},
    headerStyle = {},
    rowStyle = {},
    cellStyle = {}, // General cell style
    headerTextStyle = {},
    rowTextStyle = {}, // General row text style
    paginationStyle = {},
    noDataMessage = "No data available",
    itemsPerPage
}) => {
    const initialRowsPerPage = itemsPerPage || defaultRowsPerPage;
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const [paginatedData, setPaginatedData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const isServerSide = paginationType === 'server';

    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    useEffect(() => {
        setRowsPerPage(itemsPerPage || defaultRowsPerPage);
    }, [defaultRowsPerPage, itemsPerPage]);

    useEffect(() => {
        let currentData = data || [];
        if (isServerSide) {
            setTotalPages(rowsPerPage === Infinity ? (totalRows > 0 ? 1 : 0) : Math.ceil(totalRows / rowsPerPage));
            setPaginatedData(currentData);
        } else {
            if (currentData && currentData.length > 0) {
                if (rowsPerPage === Infinity) {
                    setTotalPages(1);
                    setPaginatedData(currentData);
                } else {
                    setTotalPages(Math.ceil(currentData.length / rowsPerPage));
                    const start = (currentPage - 1) * rowsPerPage;
                    const end = start + rowsPerPage;
                    setPaginatedData(currentData.slice(start, end));
                }
            } else {
                setPaginatedData([]);
                setTotalPages(0);
            }
        }
    }, [data, currentPage, rowsPerPage, isServerSide, totalRows]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && (newPage <= totalPages || totalPages === 0)) {
            setCurrentPage(newPage);
            if (isServerSide && onPageChange) {
                onPageChange(newPage, rowsPerPage);
            }
        }
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        const currentDataLength = data?.length || 0;
        const effectiveTotalRows = isServerSide ? totalRows : currentDataLength;

        const newTotalPages = newRowsPerPage === Infinity ? (effectiveTotalRows > 0 ? 1 : 0) : Math.ceil(effectiveTotalRows / newRowsPerPage);
        let newCurrentPage = currentPage;

        if (currentPage > newTotalPages && newTotalPages > 0) {
            newCurrentPage = newTotalPages;
        } else if (newTotalPages === 0 && effectiveTotalRows > 0 && newRowsPerPage !== Infinity) {
            // This case might happen if data is empty but totalRows is not, and rowsPerPage is not Infinity
            newCurrentPage = 1;
        } else if (newTotalPages === 0) {
            newCurrentPage = 1;
        }


        setRowsPerPage(newRowsPerPage);
        setCurrentPage(newCurrentPage);
        setIsDropdownVisible(false);
        if (isServerSide && onPageChange) {
            onPageChange(newCurrentPage, newRowsPerPage);
        }
    };

    const renderHeader = () => (
        <View style={[styles.tableHeader, headerStyle]}>
            {columns.map((col, index) => (
                <Text key={index} style={[styles.headerCell, headerTextStyle, col.key === 'serial'
                    ? { width: 40, marginLeft: 5 }
                    : col.flex
                        ? { flex: col.flex }
                        : col.width
                            ? { width: col.width }
                            : { flex: 1 }]}>
                    {col.label}
                </Text>
            ))}
        </View>
    );

    const renderRow = ({ item, index: rowIndex }) => {
        const actualIndex = (currentPage - 1) * (rowsPerPage === Infinity ? data.length : rowsPerPage) + rowIndex;
        return (
            <View key={item.id || rowIndex} style={[styles.tableRow, rowStyle]}>
                {columns.map((col, colIndex) => (
                    <View key={colIndex} style={[styles.cellContainer, cellStyle, col.key === 'serial'
                        ? { width: 40, marginLeft: 5 }
                        : col.flex
                            ? { flex: col.flex }
                            : col.width
                                ? { width: col.width }
                                : { flex: 1 }]}>

                        {col.key === 'serial' ? (
                            <Text style={[styles.cell, rowTextStyle]} numberOfLines={1}>
                                {String(actualIndex + 1).padStart(2, '0')}
                            </Text>
                        ) : (
                            <Text style={[styles.cell, rowTextStyle]} numberOfLines={2}>
                                {item[col.key] !== undefined && item[col.key] !== null ? String(item[col.key]) : ''}
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const getPaginationNumbers = () => {
        if (rowsPerPage === Infinity) return [1]; // Only one page if 'All' is selected

        const pageNeighbours = 1;
        const totalNumbers = (pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages <= totalBlocks) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        const leftBound = currentPage - pageNeighbours;
        const rightBound = currentPage + pageNeighbours;

        pages.push(1);
        if (leftBound > 2) pages.push('...');
        for (let i = Math.max(2, leftBound); i <= Math.min(totalPages - 1, rightBound); i++) {
            pages.push(i);
        }
        if (rightBound < totalPages - 1) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    const renderPagination = () => {
        const pageNumbers = getPaginationNumbers();

        return (
            <View style={[styles.paginationOuterContainer, paginationStyle]}>
                {/* Always show rowsPerPage dropdown */}
                <View style={styles.rowsPerPageDropdownContainer}>
                    <TouchableOpacity onPress={() => setIsDropdownVisible(true)} style={styles.dropdownTrigger}>
                        <Text style={styles.dropdownTriggerText}>
                            {rowsPerPage === Infinity ? 'All' : rowsPerPage} / page
                        </Text>
                        <Text style={styles.dropdownTriggerArrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Conditionally show page navigation */}
                {!(totalPages <= 1 && rowsPerPage === Infinity) && (
                    <View style={styles.pagination}>
                        <TouchableOpacity onPress={() => handlePageChange(1)} disabled={currentPage === 1 || loading || rowsPerPage === Infinity}>
                            <Text style={[styles.pageControl, (currentPage === 1 || loading || rowsPerPage === Infinity) && styles.disabledPageControl]}>{'<<'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading || rowsPerPage === Infinity}>
                            <Text style={[styles.pageControl, (currentPage === 1 || loading || rowsPerPage === Infinity) && styles.disabledPageControl]}>{'<'}</Text>
                        </TouchableOpacity>

                        {pageNumbers.map((page, index) =>
                            page === '...' ? (
                                <Text key={`ellipsis-${index}`} style={styles.ellipsisStyle}>...</Text>
                            ) : (
                                <TouchableOpacity key={page} onPress={() => handlePageChange(page)} disabled={rowsPerPage === Infinity}>
                                    <Text style={[
                                        styles.pageNumber,
                                        currentPage === page && styles.activePage,
                                        (rowsPerPage === Infinity && page !== 1) && styles.disabledPageControl
                                    ]}>{page}</Text>
                                </TouchableOpacity>
                            )
                        )}

                        <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading || rowsPerPage === Infinity}>
                            <Text style={[styles.pageControl, (currentPage === totalPages || loading || rowsPerPage === Infinity) && styles.disabledPageControl]}>{'>'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePageChange(totalPages)} disabled={currentPage === totalPages || loading || rowsPerPage === Infinity}>
                            <Text style={[styles.pageControl, (currentPage === totalPages || loading || rowsPerPage === Infinity) && styles.disabledPageControl]}>{'>>'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.tableWrapper, tableStyle]}>
            {renderHeader()}
            {loading && (
                <View style={styles.loadingStateContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary || '#000'} />
                </View>
            )}
            {!loading && paginatedData.length === 0 && (
                <View style={styles.noDataStateContainer}>
                    <Text style={styles.noDataStateText}>{noDataMessage}</Text>
                </View>
            )}
            {!loading && paginatedData.length > 0 && (
                <FlatList
                    data={paginatedData}
                    renderItem={renderRow}
                    keyExtractor={(item, index) => item.id || `row-${index}`}
                />
            )}
            {renderPagination()}
            <Modal
                transparent={true}
                visible={isDropdownVisible}
                onRequestClose={() => setIsDropdownVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setIsDropdownVisible(false)}>
                    <View style={styles.dropdownMenu}>
                        {rowsPerPageOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.dropdownMenuItem}
                                onPress={() => handleRowsPerPageChange(option)}
                            >
                                <Text style={styles.dropdownMenuItemText}>{option === Infinity ? 'All' : option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    tableWrapper: {
        marginTop: 20, // Adjusted from 30
        borderRadius: 10,
        backgroundColor: theme.colors.white || '#FFFFFF', // Added background
        shadowColor: theme.colors.black || '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: theme.colors.tableHeader || '#f0a028',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 2, // Added horizontal padding
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12, // Adjusted
        paddingHorizontal: 2, // Added horizontal padding
        borderBottomWidth: 0.5,
        borderColor: theme.colors.lightGray || '#D3D3D3',
    },
    headerCell: { // Applied to Text inside header
        color: theme.colors.white || '#fff',
        fontFamily: theme.fonts.interBold,
        fontSize: 13, // Adjusted
        textAlign: 'center',
        paddingHorizontal: 2, // Added for spacing
    },
    cellContainer: { // Wrapper for each cell content for better flex/width handling
        justifyContent: 'center',
        alignItems: 'center', // Default to center, can be overridden by cellStyle
        paddingHorizontal: 2, // Added for spacing
    },
    cell: { // Applied to Text inside data row cells
        fontSize: 12,
        fontFamily: theme.fonts.interRegular,
        color: theme.colors.textBlack || '#444',
        textAlign: 'center',
    },
    paginationOuterContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: theme.colors.lightGray || '#EEEEEE',
        backgroundColor: theme.colors.lightGrayBackground || '#F8F9FA',
    },
    rowsPerPageDropdownContainer: {
        marginBottom: 10,
        alignSelf: 'flex-end',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.colors.lightGray || '#D3D3D3',
        borderRadius: 5,
        backgroundColor: theme.colors.white || '#FFFFFF',
        alignItems: 'center',
    },
    dropdownTriggerText: {
        fontSize: 14,
        color: theme.colors.textBlack || '#333333',
        fontFamily: theme.fonts.interRegular,
    },
    dropdownTriggerArrow: {
        marginLeft: 8,
        fontSize: 12,
        color: theme.colors.textGray || '#5F6A6A',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8, // Adjusted
    },
    pageNumber: {
        fontSize: 13,
        fontFamily: theme.fonts.interBold,
        paddingHorizontal: 10, // Adjusted
        paddingVertical: 6,  // Adjusted
        color: theme.colors.textGray || '#555', // Changed from primaryOrange
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.lightGray || '#ccc',
    },
    activePage: {
        backgroundColor: theme.colors.primary || '#ccc',
        color: theme.colors.white || '#fff',
        borderColor: theme.colors.primary || '#ccc',
    },
    pageControl: {
        fontSize: 18, // Adjusted
        color: theme.colors.textGray || '#444',
        paddingHorizontal: 6,
        fontFamily: theme.fonts.interBold,
    },
    disabledPageControl: {
        color: theme.colors.mediumGray || '#A0A0A0',
    },
    ellipsisStyle: {
        marginHorizontal: 5,
        color: theme.colors.textGray || '#5F6A6A',
        fontSize: 14,
        paddingVertical: 8,
        fontFamily: theme.fonts.interRegular,
    },
    reprintBtn: {
        // Styles for reprint button if needed, e.g., padding
        backgroundColor: theme.colors.primary,
        padding: 8,
        borderRadius: 5
    },
    reprintBtnText: {
        color: theme.colors.white, // Assuming accentGreen from your constants
        fontFamily: theme.fonts.interMedium,
        fontSize: 12,
        // textDecorationLine: 'underline', // Added for "button" feel
    },
    loadingStateContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    noDataStateContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    noDataStateText: {
        fontSize: 16,
        color: theme.colors.textGray || '#5F6A6A',
        fontFamily: theme.fonts.interRegular,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Darker overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        backgroundColor: theme.colors.white || '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 5, // Reduced padding
        width: '50%', // Adjusted width
        maxHeight: '40%',
        shadowColor: theme.colors.black || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    dropdownMenuItem: {
        paddingVertical: 10, // Adjusted
        paddingHorizontal: 15, // Adjusted
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.lightBorder || '#EEEEEE',
    },
    dropdownMenuItemText: {
        fontSize: 15, // Adjusted
        color: theme.colors.textBlack || '#333333',
        textAlign: 'center',
        fontFamily: theme.fonts.interRegular,
    },
});

export default Table;
